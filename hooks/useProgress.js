import { useState, useEffect } from 'react';

const useProgress = (email, chapter) => {
  const [progress, setProgress] = useState(0);
  const [subProgress, setSubProgress] = useState({});

  useEffect(() => {
    console.log("trying");
    if (!email) return;
    console.log("found");
    console.log(chapter);

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        // Find chapter by name (case-insensitive)
        const foundChapter = data.chapters.find(
          (ch) => ch.chapterName?.toLowerCase() === chapter?.toLowerCase()
        );

        // Set chapter progress
        setProgress(foundChapter ? foundChapter.progress : 0);

        // Set sublesson progress as { subLessonName: progress }
        if (foundChapter && foundChapter.subLessons) {
          const subProgressMap = foundChapter.subLessons.reduce((acc, subLesson) => {
            acc[subLesson.subLessonName] = subLesson.progress || 0;
            return acc;
          }, {});
          setSubProgress(subProgressMap);
        } else {
          setSubProgress({});
        }

        console.log('Progress saved:', data);
      } catch (err) {
        console.error('Error saving progress:', err.message);
      }
    };

    fetchProgress();
  }, [email, chapter]);

  console.log(progress, subProgress)
  return { progress, subProgress };
};

export default useProgress;