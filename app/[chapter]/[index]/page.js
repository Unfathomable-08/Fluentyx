'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { ArToEn, EnToAr, MatchSound, Draw, SelectCorrect } from "../../../components/Exercise"

export default function Alphabet() {
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

    const stepMod = step % 5;

    return (
      <div>
        {stepMod === 1 && <ArToEn data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} />}
        {stepMod === 2 && <EnToAr data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} />}
        {stepMod === 3 && <MatchSound data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} />}
        {stepMod === 4 && <Draw data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} />}
        {stepMod === 0 && <SelectCorrect data={chapterData} chapter={chapterName} step={step} setStep={setStep} index={index} />}
      </div>
    );
}