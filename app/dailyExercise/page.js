"use client"

import { useEffect, useState, useContext } from 'react'
import useAuth from "../../hooks/useAuth"
import useSaveProgress from "../../hooks/useSaveProgress"
import { PronounToEn } from "../../components/pronouns/Exercise1"
import { PronounToAr } from "../../components/pronouns/Exercise2"
import { FillBlank } from "../../components/pronouns/Exercise3"
import { FillEnBlank } from "../../components/pronouns/Exercise4"
import { MatchPronounSound } from "../../components/pronouns/Exercise5"
import CircularProgress from "../../sub-components/CircularProgress"
import { useRouter } from 'next/navigation'
import { showToast } from '../../lib/toastify'

export default function DailyExercise () {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [chapterData, setChapterData] = useState({});
  const [chapterName, setChapterName] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [step, setStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [correctAttempts, setCorrectAttepmts] = useState(0);
  const [wrongAttempts, setWrongAttepmts] = useState(0);
  const [stepsPerLesson, setStepsPerLesson] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [getProgress, setGetProgress] = useState(false);
  const [parentProgress, setParentProgress] = useState(0);

  const router = useRouter();

  const { saveProgress, isProgressLoading, error } = useSaveProgress();

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${user.email}`);
        const data = await res.json();

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
    
    // Calculate steps for each lesson
    const steps = toReview.map(([name, index, focus]) => ({
      chapterName: name,
      subLessonName: index,
      steps: totalFocus > 0 ? Math.round((focus / totalFocus) * 100) : 0,
    }));

    // Adjust steps to ensure total is 100
    const currentTotal = steps.reduce((sum, { steps }) => sum + steps, 0);
    if (currentTotal !== 100 && steps.length > 0) {
      const diff = 100 - currentTotal;
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

        // Get all sub-lessons (including duplicates) for chapterName
        const allSubLessons = toReview.map(item => item[0]);
        
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

        // Update chapterName state
        setChapterName(allSubLessons);
        
        const stepsPerLesson = calculateSteps(toReview);
        setStepsPerLesson(stepsPerLesson);
        
      } catch (err) {
        console.error('Failed to fetch chapter data:', err.message);
      }
    };

    fetchChapterData();
  }, [toReview]);

  useEffect(() => {
    if (toReview && toReview.length > 0 && step == 1){
      setCurrentChapter(toReview[0][0]);
      setCurrentIndex(toReview[0][1]);
    }
    
    if (wrongAttempts >= 33){
      showToast("success", "Oops! You did not make it. But your progress is saved.");
      router.push(`/dailyExercise`);
    }

    if (step == 100){
      setStep(1);
    }

    let stepToMove = stepsPerLesson.filter((item) => (
      item.chapterName == currentChapter && item.subLessonName == currentIndex
    ))

    if (step > stepToMove[0]?.steps){
      saveProgress({ user, chapterName: currentChapter, index: currentIndex, correctAttempts, wrongAttempts, isDaily: true });
      setCurrentChapter(toReview[currentPosition + 1][0]);
      setCurrentIndex(toReview[currentPosition + 1][1]);
      setCorrectAttepmts(0);
      setWrongAttepmts(0);
      setCurrentPosition(prev => prev + 1);
    }

  }, [step, toReview]);

  const pausefn = () => {
    setGetProgress(true);
    saveProgress({ user, chapterName: currentChapter, index: currentIndex, correctAttempts, wrongAttempts, isDaily: true });
    showToast("success", "Your progress is saved.");
  }

  const completedFn = () => {
    setGetProgress(true);
    saveProgress({ user, chapterName: currentChapter, index: currentIndex, correctAttempts, wrongAttempts, isDaily: true });
    showToast("success", "Congratulations! You have completed the daily exercise.");
  }

  useEffect(() => {
    const postStreak = async () => {
      console.log(step)
      if (parentProgress != 0 && step != 1) {
        const response = await fetch('/api/streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            date: new Date(),
            totalTime: parentProgress,
          }),
        });
        const data = await response.json();
        console.log(data);
      }
    };
    postStreak();
  }, [parentProgress]);

  const stepMod = step % 5;

  if (!isAuthenticated){
    return null;
  }
  
  return (
    <>
      <div className='w-[90%] mt-2 gap-x-4 flex justify-center items-center flex justify-self-center'>
        <div className='w-full bg-white h-4 border rounded-full border-[var(--secondary)]'>
          <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * step / 100}%`}}></div>
        </div>
        <div className="transform">
          <CircularProgress totalTime={300} radius={25} stroke={4} fontSize={14} getProgress={getProgress} setParentProgress={setParentProgress} completedFn={completedFn} email={user.email} />
        </div>
      </div>

      <div className='flex justify-self-center gap-x-4'>
        <button className='px-4 py-1 bg-red-600 hover:bg-red-800 text-white rounded-full text-sm' onClick={()=>router.push('/dailyExercise')}>Restart</button>
        <button className='px-4 py-1 bg-green-600 hover:bg-green-800 text-white rounded-full text-sm' onClick={()=>pausefn()}>Pause</button>
      </div>

      <PronounToEn
        data={chapterData[currentChapter]}
        chapter={currentChapter} 
        step={step} setStep={setStep} 
        index={currentIndex} 
        isActive={stepMod == 1} 
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
      />

      <PronounToAr
        data={chapterData[currentChapter]}
        chapter={currentChapter}
        step={step} setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 2}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

      <FillEnBlank
        data={chapterData[currentChapter]}
        chapter={currentChapter}
        step={step}
        setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 3}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

      <FillBlank
        data={chapterData[currentChapter]}
        chapter={currentChapter}
        step={step}
        setStep={setStep}
        index={currentIndex}
        isActive={stepMod == 4}
        setCorrectAttepmts={setCorrectAttepmts}
        setWrongAttepmts={setWrongAttepmts}
        />

       <MatchPronounSound
         data={chapterData[currentChapter]}
         chapter={currentChapter}
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