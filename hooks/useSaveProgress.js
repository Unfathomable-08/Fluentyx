import { useState, useCallback } from 'react';

export default function useSaveProgress( user, chapterName, index, correctAttempts, wrongAttempts ) {
  const [isProgressLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProgress = useCallback(
    async ({ user, chapterName, index, correctAttempts, wrongAttempts }) => {
        console.log(user, chapterName, index, correctAttempts, wrongAttempts)
      if (!user || !chapterName || index === undefined || index === null) {
        setError('Missing required parameters: user, chapterName, or subLessonName');
        console.log("not found")
        return false;
      }

      setIsLoading(true);
      setError(null);

      const attempts = (wrongAttempts || 0) + (correctAttempts || 0);
      const progressMap = {
        alphabets: { chapterProgress: 0.3448, lessonProgress: 10 },
        pronouns: { chapterProgress: 6.25, lessonProgress: 25 },
        prepositions: { chapterProgress: 5, lessonProgress: 25 },
      };

      const progressValues = progressMap[chapterName.toLowerCase()] || { chapterProgress: 0, lessonProgress: 0 };
      const { chapterProgress, lessonProgress } = progressValues;
      console.log(chapterProgress, lessonProgress)

      try {
        const response = await fetch(`/api/progress/${user.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapters: [
            {
                chapterName: chapterName,
                subLessons: [
                {
                    subLessonName: index,
                    attempts: attempts,
                    correctAttempts: correctAttempts,
                    lastAttempted: new Date(),
                    progress: lessonProgress
                }
                ],
                progress: chapterProgress
            }
            ]
        })
        });

        const data = await response.json();
        console.log(data)

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save progress');
        }

        setIsLoading(false);
        return true; // Success
      } catch (err) {
        setError(err.message || 'An error occurred while saving progress');
        setIsLoading(false);
        return false; // Failure
      }
    },
    [user, chapterName, index, correctAttempts, wrongAttempts]
  );

  return { saveProgress, isProgressLoading, error };
}
