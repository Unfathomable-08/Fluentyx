import mongoose from 'mongoose';
import Streak from '@/models/streak'
import connectDB from '@/lib/db'

// Helper function to get the start of the current week (Sunday)
const getWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek; // Adjust to Sunday
  return new Date(now.setDate(diff)).setHours(0, 0, 0, 0);
};

// Helper function to check if a date is within the current week
const isDateInCurrentWeek = (date) => {
  const weekStart = new Date(getWeekStart());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Saturday
  weekEnd.setHours(23, 59, 59, 999);
  return date >= weekStart && date <= weekEnd;
};

// POST route to record exercise data
export async function POST(req) {
  try {
    await connectDB();
    const { email, date, totalTime } = await req.json();

    if (!email || !date || totalTime === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure date is within the current week
    if (!isDateInCurrentWeek(parsedDate)) {
      return new Response(JSON.stringify({ error: 'Date must be within the current week (Sunday to Saturday)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let streak = await Streak.findOne({ email });

    if (!streak) {
      streak = new Streak({ email });
    }

    // Reset streak data if it's a new week (check if lastCompletedDate is from a previous week)
    if (streak.lastCompletedDate && !isDateInCurrentWeek(streak.lastCompletedDate)) {
      streak.currentStreak = 0;
      streak.completedDates = [];
    }

    // Check if the date is already recorded
    const dateIndex = streak.completedDates.findIndex(
      (entry) => entry.date.toISOString().split('T')[0] === parsedDate.toISOString().split('T')[0]
    );

    if (dateIndex !== -1) {
      // Date exists, update totalTime by adding the new totalTime
      streak.completedDates[dateIndex].totalTime += totalTime;

      // Recalculate if the day is completed (totalTime >= 300 seconds)
      const isCompleted = streak.completedDates[dateIndex].totalTime >= 300;

      // If the day wasn't previously completed but is now, update streak
      if (isCompleted && !streak.completedDates[dateIndex].isCompleted) {
        streak.currentStreak += 1;
        streak.lastCompletedDate = parsedDate;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        streak.completedDates[dateIndex].isCompleted = true; // Optional: track completion status
      }
    } else {
      // New date, add to completedDates
      const isCompleted = totalTime >= 300; // 300 seconds threshold
      streak.completedDates.push({ date: parsedDate, totalTime, isCompleted });
      if (isCompleted) {
        streak.currentStreak += 1;
        streak.lastCompletedDate = parsedDate;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      }
    }

    await streak.save();

    return new Response(
      JSON.stringify({
        message: 'Exercise recorded successfully',
        streak: {
          email: streak.email,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCompletedDate: streak.lastCompletedDate,
          completedDates: streak.completedDates,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /streak:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET route to fetch streak data
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      // Fetch specific user's streak
      const streak = await Streak.findOne({ email });

      if (!streak) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Reset streak if last completed date is not in the current week
      if (streak.lastCompletedDate && !isDateInCurrentWeek(streak.lastCompletedDate)) {
        streak.currentStreak = 0;
        streak.completedDates = [];
        await streak.save();
      }

      return new Response(
        JSON.stringify({
          email: streak.email,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCompletedDate: streak.lastCompletedDate,
          completedDates: streak.completedDates,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Fetch top 25 users for the current week
      const streaks = await Streak.find()
        .sort({ currentStreak: -1, lastCompletedDate: -1 }) // Sort by currentStreak, then by most recent activity
        .limit(25);

      // Filter out streaks from previous weeks
      const filteredStreaks = [];
      for (let streak of streaks) {
        if (streak.lastCompletedDate && !isDateInCurrentWeek(streak.lastCompletedDate)) {
          streak.currentStreak = 0;
          streak.completedDates = [];
          await streak.save();
        }
        filteredStreaks.push({
          email: streak.email,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCompletedDate: streak.lastCompletedDate,
          completedDates: streak.completedDates,
        });
      }

      return new Response(JSON.stringify(filteredStreaks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in GET /streak:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}