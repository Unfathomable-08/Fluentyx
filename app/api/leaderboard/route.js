import { NextResponse } from 'next/server';
import Leaderboard from '@/models/leaderboard'
import connectDB from '@/lib/db'

// Helper function to check if today is Sunday (using PKT timezone)
const isSunday = () => {
  const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  return new Date(today).getDay() === 0; // 0 is Sunday
};

// POST: Store leaderboard data
export async function POST(req) {
  try {
    await connectDB(); // Ensure DB connection

    // If it's Sunday, delete all leaderboard data
    if (isSunday()) {
      const lastSunday = new Date();
      lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
      lastSunday.setHours(0, 0, 0, 0);
      await Leaderboard.updateMany(
        { updatedAt: { $lt: lastSunday } },
        { weekly_score: 0 }
      );
    }

    const { email, name, weekly_score, trophies } = await req.json();

    // Validate required fields
    if (!email || !name || weekly_score === undefined) {
      return NextResponse.json({ error: 'Email, name, and weekly_score are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await Leaderboard.findOne({ email });

    if (existingUser) {
      // Update existing user (preserve trophies, update other fields)
      existingUser.name = name;
      existingUser.weekly_score += weekly_score;
      if (trophies && Array.isArray(trophies)) {
        existingUser.trophies = [...existingUser.trophies, ...trophies];
      }
      existingUser.updatedAt = new Date();
      await existingUser.save();
      return NextResponse.json(existingUser, { status: 200 });
    }

    // Create new leaderboard entry
    const newEntry = new Leaderboard({
      email,
      name,
      weekly_score,
      trophies: trophies && Array.isArray(trophies) ? trophies : []
    });

    await newEntry.save();
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/leaderboard:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: Fetch top 30 leaderboard entries
export async function GET() {
  try {
    await connectDB(); // Ensure DB connection

    // If it's Sunday, ensure only fresh data is returned (after reset)
    if (isSunday()) {
      if (isSunday()) {
        const lastSunday = new Date();
        lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
        lastSunday.setHours(0, 0, 0, 0);
        await Leaderboard.updateMany(
          { updatedAt: { $lt: lastSunday } },
          { weekly_score: 0 }
        );
      }
      return NextResponse.json([], { status: 200 }); // Return empty array
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
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}