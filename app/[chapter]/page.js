'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from "../../hooks/useAuth";
import useProgress from "../../hooks/useProgress";
import { ThemeContext } from '../../contexts/themeContext'

export default function Chapter() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const { chapter } = useParams();
  const router = useRouter();
  const [chapterData, setChapterData] = useState([]);
  const { theme } = useContext(ThemeContext);
  
  const { progress, subProgress } = useProgress(user?.email, chapter)

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
    // For index > 0, check if previous lesson's subProgress is greater than 80
    if (chapter !== "alphabets"){
      if ((index === 1 && (subProgress["flash"] || 0) < 80) ||
          (index >= 2 && (subProgress[index.toString()] || 0) <= 80) ) {
        return;
      }
    }
    router.push(`/${chapter}/${index}`);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <main className="px-4 py-4 sm:px-16 md:px-20 bg-[var(--bg-theme)]" style={{minHeight: 'calc(100vh - 50px)'}}>
      <div className="text-[var(--text-theme)] transform flex justify-end font-medium">
        <span>
          {progress <= 100 ? `${progress} / 100` : '100/100'}
        </span>
      </div>
      <h1 className="text-xl font-bold text-center my-4 text-[var(--text-theme)]">
        {chapter.charAt(0).toUpperCase() + chapter.slice(1).toLowerCase()}
      </h1>

      {chapter === "alphabets" ? (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 px-4 py-4 max-w-2xl justify-center mx-auto cursor-pointer" style={{ direction: 'rtl' }}>
          {chapterData.map((ch, i) => (
            <div
              key={i}
              className="w-full aspect-[3/4] arabic bg-[var(--bg-theme)] rounded-lg flex flex-col justify-evenly items-center text-center"
              onClick={() => handleClick(ch.index)}
              style={{ boxShadow: theme == "light" ? '0 0 10px #00000055' : '0 0 10px #ffffff55',
                     color: theme == "light" ? 'black' : '#e6fbe0'}}
            >
              <div>{ch.letter}</div>
              <div className='bg-white border border-[var(--secondary)] rounded-full w-[80%] h-1 mt-3' style={{ direction: 'ltr' }}>
                <div className={`bg-[var(--primary)] h-full rounded-full max-w-[100%]`} style={{width: `${subProgress[ch.index] || 0}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8 py-6">
          <div
            className="w-full h-40 bg-[var(--bg-theme)] rounded-lg flex flex-col justify-between items-center text-center cursor-pointer"
            onClick={() => router.push(`/${chapter}/flashcards`)}
            style={{ boxShadow: theme == "light" ? '0 0 10px #00000055' : '0 0 10px #ffffff55' }}
          >
            <div className='font-bold mt-10 text-lg text-[var(--text-theme)]'>Flashcards</div>
            <div className='bg-white border border-[var(--secondary)] rounded-full w-[80%] h-[6px] my-8' style={{ direction: 'ltr' }}>
              <div className={`bg-[var(--primary)] h-full rounded-full max-w-[100%]`} style={{width: `${subProgress["flash"] || 0}%`}}></div>
            </div>
          </div>
          
          {Object.entries(Object.assign({}, ...chapterData)).map(([title, data], index) => (
            <div
              key={title}
              className="w-full h-40 bg-[var(--bg-theme)] rounded-lg flex flex-col justify-between relative items-center text-center cursor-pointer"
              onClick={() => handleClick(index + 1)}
              style={{ boxShadow: theme == "light" ? '0 0 10px #00000055' : '0 0 10px #ffffff55' }}
            >
              <div className='font-bold mt-12 text-lg text-[var(--text-theme)]'>{title}</div>
              <div className='bg-white border border-[var(--secondary)] rounded-full w-[80%] h-[6px] my-8' style={{ direction: 'ltr' }}>
                <div className={`bg-[var(--primary)] h-full rounded-full max-w-[100%]`} style={{width: `${subProgress[index + 1] || 0}%`}}></div>
              </div>
              
              {/* Lock */}
              {
                (index === 0 && (subProgress["flash"] || 0) < 80) ||
                (index >= 1 && (subProgress[index.toString()] || 0) <= 80) ? (
                  <div className="absolute top-2 right-3 bg-red-600 text-white text-[12px] px-2 py-[1px] rounded-full">
                    Locked
                  </div>
                ) : null
              }
            </div>
          ))}
        </div>
      )}
    </main>
  );
}