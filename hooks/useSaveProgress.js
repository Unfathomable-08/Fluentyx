import { useState, useCallback } from 'react';

export default function useSaveProgress( user, chapterName, index, correctAttempts, wrongAttempts ) {
  const [isProgressLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProgress = useCallback(
    async ({ user, chapterName, index, correctAttempts, wrongAttempts }) => {
        console.log(user, chapterName, index, correctAttempts, wrongAttempts)
      if (!user || !chapterName || !index) {
        setError('Missing required parameters: user, chapterName, or subLessonName');
        console.log("not found")
        return false;
      }

      setIsLoading(true);
      setError(null);

      let attempts = wrongAttempts + correctAttempts

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

  return { saveProgress, isProgressLoading, error };
}