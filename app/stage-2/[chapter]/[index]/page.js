'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';

import useAuth from "../../../../hooks/useAuth";
import useSaveProgress from "../../../../hooks/useSaveProgress";
import { showToast } from "../../../../lib/toastify"

import { QToA } from "../../../../components/stage-2/Exercise1"
import { QenToAen } from "../../../../components/stage-2/Exercise2"
import { QToAtranslate } from "../../../../components/stage-2/Exercise3"
// import { FillEnBlank } from "../../../components/pronouns/Exercise4"
// import { MatchPronounSound } from "../../../components/pronouns/Exercise5"

export default function Alphabet() {
  const { isAuthenticated, user, isLoading } = useAuth();

  const router = useRouter();
  const { index } = useParams();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
  const [chapterData, setChapterData] = useState([]);
  const [step, setStep] = useState(1);

  const [correctAttempts, setCorrectAttepmts] = useState(0);
  const [wrongAttempts, setWrongAttepmts] = useState(0);

  const { saveProgress, isProgressLoading, error } = useSaveProgress();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const chapter = segments[1];

    if (!chapter) return;

    setChapterName(chapter);

    const fetchChapterData = async () => {
        try {
          const res = await fetch(`/api/chapter/?chapter=${chapter}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to fetch chapter');
          
          setChapterData(data);
        } catch (err) {
          console.error('Failed to fetch chapter:', err);
        }
    };

    fetchChapterData();
  }, [pathname]);

  useEffect(()=>{
    if (step == 25){
      saveProgress({ user, chapterName, index, correctAttempts, wrongAttempts });
      if (!error){
        router.push(`/stage-2/${chapterName}`)
      }
    }
  }, [step, chapterName, index, user])

  useEffect(() => {
    if (wrongAttempts >= 8){
      showToast("info", "Oops! You did not make it. Let's try again!");
      router.push(`/${chapterName}`)
    }
  }, [step]);

  const stepMod = step % 5;

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <div className="bg-[var(--bg-theme)] pt-6" style={{minHeight: 'calc(100vh - 50px)'}}>
        <div className='w-[80%] bg-white flex justify-self-center mt-8 h-4 border rounded-full border-[var(--secondary)]'>
            <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * step / 25}%`}}></div>
        </div>

        <QToA
         data={chapterData} 
         chapter={chapterName} 
         step={step} setStep={setStep} 
         index={index} 
         isActive={stepMod == 3} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />
      
        <QenToAen
         data={chapterData} 
         chapter={chapterName} 
         step={step} setStep={setStep} 
         index={index} 
         isActive={stepMod == 2} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />
      
        <QToAtranslate
         data={chapterData} 
         chapter={chapterName} 
         step={step} setStep={setStep} 
         index={index} 
         isActive={stepMod == 1} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />
      
        {/* <EnToAr
         data={chapterData} 
         chapter={chapterName} 
         step={step} setStep={setStep} 
         index={index} 
         isActive={stepMod == 1} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />

        <PronounToEn 
          data={chapterData}
          chapter={chapterName} 
          step={step} 
          setStep={setStep} 
          index={index} 
          isActive={stepMod == 2} 
          setCorrectAttepmts={setCorrectAttepmts}
          setWrongAttepmts={setWrongAttepmts} 
        />

        <FillEnBlank
         data={chapterData} 
         chapter={chapterName} 
         step={step} 
         setStep={setStep} 
         index={index} 
         isActive={stepMod == 3} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />

        <FillBlank
         data={chapterData} 
         chapter={chapterName} 
         step={step} 
         setStep={setStep} 
         index={index} 
         isActive={stepMod == 4} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        />

        <MatchPronounSound
         data={chapterData} 
         chapter={chapterName} 
         step={step} 
         setStep={setStep} 
         index={index} 
         isActive={stepMod == 0} 
         setCorrectAttepmts={setCorrectAttepmts}
         setWrongAttepmts={setWrongAttepmts}
        /> */}
      </div>
    );
}