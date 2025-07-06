import { NextResponse } from 'next/server';
import Leaderboard from '@/models/leaderboard';
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
      return NextResponse.json({ error: 'Email, name, and weekly_score are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch top 30 leaderboard entries
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // If email is provided, ensure user exists in the leaderboard
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
      await Leaderboard.findOneAndUpdate(
        { email },
        {
          $setOnInsert: {
            name: email.split('@')[0].replace(/\./g, ' '), // Cleaner name
            weekly_score: 0,
            trophies: [],
          },
        },
        { upsert: true }
      );
    }

    // Reset scores if today is Sunday and entries are from the previous week
    if (isSunday()) {
      const weekStart = getWeekStart();
      await Leaderboard.updateMany(
        { updatedAt: { $lt: weekStart } },
        { weekly_score: 0 } // Mongoose updates updatedAt automatically
      );
    }

    // Fetch top 30 entries sorted by weekly_score
    const leaderboard = await Leaderboard
      .find()
      .sort({ weekly_score: -1 })
      .limit(30)
      .select('name email weekly_score trophies');

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}