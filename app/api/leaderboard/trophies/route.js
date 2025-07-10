import { NextResponse } from 'next/server';
import Leaderboard from '@/models/leaderboard';
import connectDB from '@/lib/db';

// GET: Fetch trophies (for a specific user or all users)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    let query = {};
    if (email) {
      query = { email };
    }

    // Fetch trophies
    const trophiesData = await Leaderboard.find(query).select('trophies');

    // If email is provided but no user found, return empty trophies
    if (email && trophiesData.length === 0) {
      return NextResponse.json({ email, name: email.split('@')[0].replace(/\./g, ' '), trophies: [] }, { status: 200 });
    }

    // Return trophies for all users or the specific user
    return NextResponse.json(trophiesData, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/leaderboard/trophies:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}