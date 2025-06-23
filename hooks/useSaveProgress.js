import { useState, useCallback } from 'react';

export function useSaveProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProgress = useCallback(
    async ({ userId, chapterName, subLessonName, attempts, correctAttempts }) => {
      if (!userId || !chapterName || !subLessonName) {
        setError('Missing required parameters: userId, chapterName, or subLessonName');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/progress/${userId}`, {
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
                    subLessonName: subLessonName,
                    attempts: attempts,
                    correctAttempts: correctAttempts,
                    lastAttempted: new Date(),
                    progress: 100
                }
                ],
                progress: 10
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
    []
  );

  return { saveProgress, isLoading, error };
}