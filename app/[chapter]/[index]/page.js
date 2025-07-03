'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';

import useAuth from "../../../hooks/useAuth";
import useSaveProgress from "../../../hooks/useSaveProgress";
import { showToast } from "../../../lib/toastify"

import { ArToEn, EnToAr } from "../../../components/alphabets/Exercise1-2"
import { Draw } from "../../../components/alphabets/Exercise3"
import { MatchSound } from "../../../components/alphabets/Exercise4"
import { SelectCorrect } from "../../../components/alphabets/Exercise5"

import { PronounToEn } from "../../../components/pronouns/Exercise1"
import { PronounToAr } from "../../../components/pronouns/Exercise2"
import { FillBlank } from "../../../components/pronouns/Exercise3"
import { FillEnBlank } from "../../../components/pronouns/Exercise4"
import { MatchPronounSound } from "../../../components/pronouns/Exercise5"

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
    const chapter = segments[0];

    if (!chapter) return;

    setChapterName(chapter);

    const fetchChapterData = async () => {
        try {
        const res = await fetch(`/api/chapter/?chapter=${chapter}`);
        const data = await res.json();

        setChapterData(data);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
        }
    };
      
    fetchChapterData();
  }, [pathname]);

  useEffect(()=>{
    if (chapterName == "alphabets"){
      if (step == 15){
        saveProgress({ user, chapterName, index, correctAttempts, wrongAttempts });
        if (!error){
          router.push(`/${chapterName}`)
        }
      }
    }
    else {
      if (step == 25){
        saveProgress({ user, chapterName, index, correctAttempts, wrongAttempts });
        if (!error){
          router.push(`/${chapterName}`)
        }
      }
    }
  }, [step, chapterName, index, user])

  useEffect(() => {
    if (chapterName == "alphabets"){
      if (wrongAttempts >= 5){
        showToast("info", "Oops! You did not make it. Let's try again!");
        router.push(`/${chapterName}`)
      }
    }
    else {
      if (wrongAttempts >= 8){
        showToast("info", "Oops! You did not make it. Let's try again!");
        router.push(`/${chapterName}`)
      }
    }
  }, [step]);
  
  const stepMod = step % 5;

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <div className="bg-[var(--bg-theme)] pt-6" style={{minHeight: 'calc(100vh - 50px)'}}>
        {chapterName == "alphabets" ?
          (
            <>
              <div className='w-[80%] bg-white flex justify-self-center h-4 border rounded-full border-[var(--secondary)]'>
                  <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * step / 15}%`}}></div>
              </div>

              <ArToEn 
                data={chapterData} 
                chapter={chapterName} 
                step={step} 
                setStep={setStep} 
                index={index} isActive={stepMod == 1} 
                setCorrectAttepmts={setCorrectAttepmts}
                setWrongAttepmts={setWrongAttepmts} 
              />

              <EnToAr 
                data={chapterData} 
                chapter={chapterName} 
                step={step} 
                setStep={setStep} 
                index={index} 
                isActive={stepMod == 2} 
                setCorrectAttepmts={setCorrectAttepmts}
                setWrongAttepmts={setWrongAttepmts}
              />

              <Draw 
                data={chapterData} 
                chapter={chapterName} 
                step={step} 
                setStep={setStep} 
                index={index} 
                isActive={stepMod == 3} 
                setCorrectAttepmts={setCorrectAttepmts}
                setWrongAttepmts={setWrongAttepmts} 
              />

              <MatchSound 
                data={chapterData} 
                chapter={chapterName} 
                step={step} setStep={setStep} 
                index={index} 
                isActive={stepMod == 4} 
                setCorrectAttepmts={setCorrectAttepmts}
                setWrongAttepmts={setWrongAttepmts} 
              />

              <SelectCorrect
               data={chapterData} 
               chapter={chapterName} 
               step={step} 
               setStep={setStep} 
               index={index} 
               isActive={stepMod == 0} 
               setCorrectAttepmts={setCorrectAttepmts}
               setWrongAttepmts={setWrongAttepmts}
              />
            </>
          )
          :
          (
            <>
              <div className='w-[80%] bg-white flex justify-self-center mt-8 h-4 border rounded-full border-[var(--secondary)]'>
                  <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * step / 25}%`}}></div>
              </div>

              <PronounToAr
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
              />

            </>
          )
        }
      </div>
    );
}