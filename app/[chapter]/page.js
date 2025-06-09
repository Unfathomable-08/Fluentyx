'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function Chapter() {
  const { chapter } = useParams();
  const router = useRouter();
  const [chapterData, setChapterData] = useState([]);

  useEffect(() => {
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
  }, [chapter]);

  const handleClick = (index) => {
    router.push(`/${chapter}/${index}`);
  };

  return (
    <main className="px-4 py-4 sm:px-16 md:px-20">
      <h1 className="text-xl font-bold text-center mb-4 text-[var(--secondary)]">
        {chapter.charAt(0).toUpperCase() + chapter.slice(1).toLowerCase()}
      </h1>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 px-4 py-4 max-w-2xl justify-center mx-auto cursor-pointer" style={{direction: 'rtl'}}>
        {chapterData.map((ch, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] arabic bg-white shadow-[0_0_10px_#00000055] rounded-lg flex flex-col justify-evenly items-center text-center"
            onClick={() => handleClick(ch.index)}
          >
            <div>{ch.letter}</div>
            <div className='bg-white border border-[var(--secondary)] rounded-full w-[80%] h-1 mt-3' style={{direction: 'ltr'}}>
              <div className={`bg-[var(--primary)] h-full rounded-full w-[60%]`}></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}