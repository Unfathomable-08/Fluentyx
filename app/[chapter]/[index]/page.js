'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { ArToEn, EnToAr } from "../../../components/alphabets/Exercise1-2"
import { Draw } from "../../../components/alphabets/Exercise3"
import { MatchSound } from "../../../components/alphabets/Exercise4"
import { SelectCorrect } from "../../../components/alphabets/Exercise5"
import useAuth from "../../../hooks/useAuth";

import { PronounToEn } from "../../../components/pronouns/Exercise1"
import { PronounToAr } from "../../../components/pronouns/Exercise2"
import { FillBlank } from "../../../components/pronouns/Exercise3"

export default function Alphabet() {
  const { isAuthenticated, user, isLoading } = useAuth();

  const { index } = useParams();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
    const [chapterData, setChapterData] = useState([]);
    const [step, setStep] = useState(1);

    useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const chapter = segments[0];

    if (!chapter) return;

    setChapterName(chapter);

    const fetchChapterData = async () => {
        try {
        const res = await fetch(`/api/chapter/?chapter=${chapter}`);
        const data = await res.json();
        console.log(data)
        setChapterData(data);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
        }
    };
    
    fetchChapterData();
  }, [pathname]);

   // Memoize the selection logic for fill the blank exercise
  const { selectedExample, correctPronoun, sentenceWithBlank, selectedWord2Word, options } = useMemo(() => {
    if (!chapterData || chapterData.length === 0) return {};

    // Map index to pronoun category
    const pronounCategories = {
      1: { key: "First Person Pronouns", data: chapterData[0]["First Person Pronouns"] },
      2: { key: "Second Person Pronouns", data: chapterData[1]["Second Person Pronouns"] },
      3: { key: "Third Person Pronouns", data: chapterData[2]["Third Person Pronouns"] },
    };

    const currentCategory = pronounCategories[index];
    if (!currentCategory || !currentCategory.data || currentCategory.data.length === 0) return {};

    const pronouns = currentCategory.data;
    const allExamples = pronouns.flatMap(pronoun => pronoun.examples);
    if (allExamples.length === 0) return {};

    const randomExampleIndex = Math.floor(Math.random() * allExamples.length);
    const selectedExample = allExamples[randomExampleIndex];

    const correctPronoun = pronouns.find(pronoun =>
      pronoun.examples.some(example => example.id === selectedExample.id && example.sentence === selectedExample.sentence)
    );
    if (!correctPronoun) return {};

    const sentenceWithBlank = selectedExample.sentence.replace(correctPronoun.arabic, '____');
    const selectedWord2Word = selectedExample.word2word;

    const pronounOptions = pronouns
      .filter(pronoun => pronoun.person === correctPronoun.person)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(4, pronouns.length));

    if (!pronounOptions.some(opt => opt.arabic === correctPronoun.arabic)) {
      pronounOptions[Math.floor(Math.random() * pronounOptions.length)] = correctPronoun;
    }

    const options = pronounOptions.sort(() => 0.5 - Math.random());

    return { selectedExample, correctPronoun, sentenceWithBlank, selectedWord2Word, options };
  }, [chapterData, index]);

  if (!selectedExample || !correctPronoun) return null;

  
  const stepMod = step % 4;
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              <ArToEn data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 1} />
              <EnToAr data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 2} />
              <Draw data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 3} />
              {/* <MatchSound data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 4} /> */}
              <SelectCorrect data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 0} />
            </>
          )
          :
          (
            <>
              <div className='w-[80%] flex justify-self-center mt-8 mb-4 h-4 border rounded-full border-[var(--secondary)]'>
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{width: `${100 * step / 20}%`}}></div>
              </div>
              <PronounToAr data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 1} />
              <PronounToEn data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 2} />
              <FillBlank selectedExample={selectedExample} correctPronoun={correctPronoun} sentenceWithBlank={sentenceWithBlank} selectedWord2Word={selectedWord2Word} options={options} chapter={chapterName} step={step} setStep={setStep} index={index} isActive={stepMod == 3} />
            </>
          )
        }
      </div>
    );
}