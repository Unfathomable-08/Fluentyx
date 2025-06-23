'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { ArToEn, EnToAr } from "../../../components/alphabets/Exercise1-2"
import { Draw } from "../../../components/alphabets/Exercise3"
import { MatchSound } from "../../../components/alphabets/Exercise4"
import { SelectCorrect } from "../../../components/alphabets/Exercise5"
import useAuth from "../../../hooks/useAuth";

import { PronounToEn } from "../../../components/pronouns/Exercise1"
import { PronounToAr } from "../../../components/pronouns/Exercise2"
import { FillBlank } from "../../../components/pronouns/Exercise3"
import { FillEnBlank } from "../../../components/pronouns/Exercise4"

export default function Alphabet() {
  const { isAuthenticated, user, isLoading } = useAuth();

  const { index } = useParams();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
  const [chapterData, setChapterData] = useState([]);
  const [step, setStep] = useState(1);

  const [correctAttempts, setCorrectAttepmts] = useState(0);
  const [wrongAttempts, setWrongAttepmts] = useState(0);

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
  
  const stepMod = step % 5;

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <div>
        {chapterName == "alphabets" ?
          (
            <>
              <div className='w-[80%] flex justify-self-center mt-8 mb-4 h-4 border rounded-full border-[var(--secondary)]'>
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{width: `${100 * step / 12}%`}}></div>
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
              <div className='w-[80%] flex justify-self-center mt-8 mb-4 h-4 border rounded-full border-[var(--secondary)]'>
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{width: `${100 * step / 20}%`}}></div>
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