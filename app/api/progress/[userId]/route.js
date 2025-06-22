import connectDB from '@/lib/db';
import Progress from '@/models/progress';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();
  const { userId } = await params;
  
  try {
    const progress = await Progress.findOne({ userId: userId.toLowerCase() });
    if (!progress) {
      return NextResponse.json({ userId: userId.toLowerCase(), chapters: [], createdAt: new Date(), updatedAt: new Date() }, { status: 200 });
    }
    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json(
          { error: 'Server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
}
}

export async function POST(req, { params }) {
  try {
    await connectDB(); // Ensure DB connection
    const { userId } = params;

    const body = await req.json();
    const { chapters } = body;

    if (!userId || !chapters) {
      return NextResponse.json({ error: "Missing userId or chapters" }, { status: 400 });
    }

    // Check if progress already exists for this user
    const existing = await Progress.findOne({ userId: userId.toLowerCase() });

    if (existing) {
      // Update existing document
      existing.chapters = chapters;
      await existing.save();
      return NextResponse.json({ message: "Progress updated", data: existing }, { status: 200 });
    } else {
      // Create new document
      const newProgress = await Progress.create({ userId, chapters });
      return NextResponse.json({ message: "Progress created", data: newProgress }, { status: 201 });
    }

  } catch (err) {
    console.error("Progress POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
