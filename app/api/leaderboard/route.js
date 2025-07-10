import { NextResponse } from 'next/server';
import Leaderboard from '@/models/leaderboard';
import ResetLog from '@/models/resetLog'; // Import the new ResetLog model
import connectDB from '@/lib/db';

// Helper function to check if today is Sunday (using PKT timezone)
const isSunday = () => {
  const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  return new Date(today).getDay() === 0; // 0 is Sunday
};

// Helper function to get the start of the current week (Sunday midnight in PKT)
const getWeekStart = () => {
  const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// POST: Store leaderboard data
export async function POST(req) {
  try {
    await connectDB();

    const { email, name, weekly_score, trophies } = await req.json();

    // Validate required fields
    if (!email || !name || weekly_score === undefined) {
      return NextResponse.json({ message: 'Email, name, and weekly_score are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await Leaderboard.findOne({ email });

    if (existingUser) {
      // Update existing user
      existingUser.name = name;
      existingUser.weekly_score += weekly_score; // Accumulate score
      if (trophies && Array.isArray(trophies)) {
        existingUser.trophies = [...existingUser.trophies, ...trophies];
      }
      await existingUser.save(); // Mongoose updates updatedAt automatically
      return NextResponse.json(existingUser, { status: 200 });
    }

    // Create new leaderboard entry
    const newEntry = new Leaderboard({
      email,
      name,
      weekly_score,
      trophies: trophies && Array.isArray(trophies) ? trophies : [],
    });

    await newEntry.save();
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/leaderboard:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch top 30 leaderboard entries
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let user = null;

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
      }
      user = await Leaderboard.findOneAndUpdate(
        { email },
        {
          $setOnInsert: {
            name: email.split('@')[0].replace(/\./g, ' '),
            weekly_score: 0,
            trophies: [],
          },
        },
        { upsert: true, new: true }
      );
    }

    if (isSunday()) {
      const weekStart = getWeekStart();

      // Check if reset has already occurred for this week
      const lastReset = await ResetLog.findOne({ weekStart }).sort({ resetDate: -1 });

      if (!lastReset) {
        // Step 1: Get top 3 users before resetting scores
        const topUsers = await Leaderboard
          .find()
          .sort({ weekly_score: -1, updatedAt: -1 }) // Secondary sort by updatedAt for ties
          .limit(3)
          .select('email weekly_score trophies');

        // Step 2: Award trophies to top 3 users
        const trophyAwards = ['gold', 'silver', 'bronze'];
        for (let i = 0; i < topUsers.length; i++) {
          const user = topUsers[i];
          if (user.weekly_score > 0) { // Only award if they have a positive score
            await Leaderboard.updateOne(
              { email: user.email },
              { $push: { trophies: trophyAwards[i] } }
            );
          }
        }

        // Step 3: Reset weekly_score for all users
        await Leaderboard.updateMany(
          {}, // Apply to all users
          { weekly_score: 0 }
        );

        // Step 4: Log the reset
        await ResetLog.create({ resetDate: new Date(), weekStart });
      }
    }

    // Step 5: Fetch top 30 leaderboard entries
    const leaderboard = await Leaderboard
      .find()
      .sort({ weekly_score: -1, updatedAt: -1 }) // Secondary sort for consistency
      .limit(30)
      .select('name email weekly_score trophies');

    if (email && user) {
      const inTop30 = leaderboard.some(u => u.email === email);
      if (!inTop30) {
        leaderboard.push({
          name: user.name,
          email: user.email,
          weekly_score: user.weekly_score,
          trophies: user.trophies,
        });
      }
    }

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}