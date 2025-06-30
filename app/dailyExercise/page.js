"use client"

import { useEffect, useState, useContext } from 'react';
import useAuth from "../../hooks/useAuth";
import useSaveProgress from "../../hooks/useSaveProgress";
import { PronounToEn } from "../../components/pronouns/Exercise1"
import { PronounToAr } from "../../components/pronouns/Exercise2"
import { FillBlank } from "../../components/pronouns/Exercise3"
import { FillEnBlank } from "../../components/pronouns/Exercise4"
import { MatchPronounSound } from "../../components/pronouns/Exercise5"

export default function DailyExercise () {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [chapterData, setChapterData] = useState({});
  const [chapterName, setChapterName] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [step, setStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [correctAttempts, setCorrectAttepmts] = useState(0);
  const [wrongAttempts, setWrongAttepmts] = useState(0);
  const [stepsPerLesson, setStepsPerLesson] = useState([]);

  const { saveProgress, isProgressLoading, error } = useSaveProgress();

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${user.email}`);
        const data = await res.json();
        console.log(data);

        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        const newReview = data.chapters.flatMap((ch) =>
          ch.subLessons
            .filter((sub) => {
              // Handle division by zero and determine if sub-lesson needs review
              const percentage =
                sub.attempts > 0 && (sub.correctAttempts / sub.attempts) * 100;
              // Include sub-lessons with less than 100% completion
              return percentage < 100 && sub.attempts > 0;
            })
            .map((sub) => {
              const percentage =
                sub.attempts > 0 && (sub.correctAttempts / sub.attempts) * 100;
              return [ch.chapterName, sub.subLessonName, 100 - percentage];
            })
        );

        console.log(newReview)
        setToReview(newReview);
      } catch (err) {
        console.error('Error fetching progress:', err.message);
      }
    };

    fetchProgress();
  }, [user]);
  
  const calculateSteps = (toReview) => {
    // Sum of focus percentages
    const totalFocus = toReview.reduce((sum, [, , focus]) => sum + focus, 0);
    console.log(totalFocus)
    // Calculate steps for each lesson
    const steps = toReview.map(([name, index, focus]) => ({
      chapterName: name,
      subLessonName: index,
      steps: totalFocus > 0 ? Math.round((focus / totalFocus) * 35) : 0,
    }));

    // Adjust steps to ensure total is 35
    const currentTotal = steps.reduce((sum, { steps }) => sum + steps, 0);
    if (currentTotal !== 35 && steps.length > 0) {
      const diff = 35 - currentTotal;
      steps[0].steps += diff; // Add/subtract difference to first lesson
    }

    return steps;
  };

  useEffect(() => {
    if (!toReview || !toReview.length) return;

    const fetchChapterData = async () => {
      try {
        // Extract unique subLessonName values from toReview
        const uniqueSubLessons = [...new Set(toReview.map(item => item[0]))];

        // Fetch data for each unique sub-lesson
        const fetchPromises = uniqueSubLessons.map(async (subLesson) => {
          const res = await fetch(`/api/chapter/?chapter=${subLesson}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || `Failed to fetch chapter for ${subLesson}`);
          return { subLesson, data };
        });

        // Wait for all fetch requests to complete
        const results = await Promise.all(fetchPromises);

        // Transform results into an object or array for chapterData
        const chapterDataMap = results.reduce((acc, { subLesson, data }) => {
          acc[subLesson] = data;
          return acc;
        }, {});

        // Update state with fetched data
        setChapterData(chapterDataMap);

        setChapterName(uniqueSubLessons);
        
        const stepsPerLesson = calculateSteps(toReview);
        setStepsPerLesson(stepsPerLesson);
        
      } catch (err) {
        console.error('Failed to fetch chapter data:', err.message);
      }
    };

    fetchChapterData();
  }, [toReview]);

  useEffect(() => {
    if (wrongAttempts >= 12){
      showToast("info", "Oops! You did not make it. Let's try again!");
      router.push(`/dailyExercise`)
    }

    console.log(stepsPerLesson)
    let stepToMove = stepsPerLesson.filter((item) => (
      item.chapterName == chapterName[currentChapter] && item.subLessonName == currentIndex
    ))

    console.log("steps" ,stepToMove)
    if (step > stepToMove[0]?.steps){
      saveProgress({ user, chapterName: chapterName[currentChapter], index: currentIndex, correctAttempts, wrongAttempts, isDaily: true });
      setCurrentChapter(prev => prev + 1);
      setCurrentIndex(1);
      setCorrectAttepmts(0);
      setWrongAttepmts(0);
    }

  }, [step]);

  const stepMod = step % 5;

  if (!isAuthenticated){
    return null;
  }
  
  return (
    <>
      <div className='w-[80%] bg-white flex justify-self-center mt-8 h-4 border rounded-full border-[var(--secondary)]'>
        <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * step / 25}%`}}></div>
      </div>

      <PronounToEn
        data={chapterData[chapterName[currentChapter]]}
        chapter={chapterName[currentChapter]} 
        step={step} setStep={setStep} 
        index={currentIndex} 
        isActive={stepMod == 1} 
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
      />

      <PronounToAr
        data={chapterData[chapterName[currentChapter]]}
        chapter={chapterName[currentChapter]}
        step={step} setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 2}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

      <FillEnBlank
        data={chapterData[chapterName[currentChapter]]}
        chapter={chapterName[currentChapter]}
        step={step}
        setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 3}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

      <FillBlank
        data={chapterData[chapterName[currentChapter]]}
        chapter={chapterName[currentChapter]}
        step={step}
        setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 4}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

       <MatchPronounSound
         data={chapterData[chapterName[currentChapter]]}
         chapter={chapterName[currentChapter]}
         step={step}
         setStep={setStep}
         index={currentIndex}
         isActive={stepMod == 0}
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
         />
    </>
  );
};