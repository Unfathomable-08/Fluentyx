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
    await connectDB();
    const { userId } = params;
    const body = await req.json();
    const { chapters } = body; // Expecting a single chapter with one subLesson

    if (!userId || !chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: "Invalid userId or chapters data" }, { status: 400 });
    }

    const newChapter = chapters[0]; // Only one chapter per request
    const newSubLesson = newChapter.subLessons[0]; // Only one subLesson per request

    const progressDoc = await Progress.findOne({ userId: userId.toLowerCase() });

    if (progressDoc) {
      const chapterIndex = progressDoc.chapters.findIndex(
        c => c.chapterName === newChapter.chapterName
      );

      if (chapterIndex > -1) {
        // Chapter exists
        const subLessonIndex = progressDoc.chapters[chapterIndex].subLessons.findIndex(
          s => s.subLessonName === newSubLesson.subLessonName
        );

        if (subLessonIndex > -1) {
          // SubLesson exists → update
          progressDoc.chapters[chapterIndex].subLessons[subLessonIndex] = {
            ...progressDoc.chapters[chapterIndex].subLessons[subLessonIndex],
            ...newSubLesson
          };
        } else {
          // SubLesson doesn't exist → push it
          progressDoc.chapters[chapterIndex].subLessons.push(newSubLesson);
        }

        // Optionally update chapter progress
        progressDoc.chapters[chapterIndex].progress = newChapter.progress;

      } else {
        // Chapter doesn't exist → push it
        progressDoc.chapters.push(newChapter);
      }

      await progressDoc.save();
      return NextResponse.json({ message: "Progress updated", data: progressDoc }, { status: 200 });
    } else {
      // No progress document → create new
      const newProgress = await Progress.create({
        userId,
        chapters: [newChapter]
      });
      return NextResponse.json({ message: "Progress created", data: newProgress }, { status: 201 });
    }

  } catch (err) {
    console.error("Progress POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
