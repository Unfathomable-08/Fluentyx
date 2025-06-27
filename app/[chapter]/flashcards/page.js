'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from "../../../hooks/useAuth";

export default function Flashcards() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
  const [chapterData, setChapterData] = useState([]);
  const [pronouns, setPronouns] = useState([]);
  const [currentPronounIndex, setCurrentPronounIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const segments = pathname.split('/').filter(Boolean);
    const chapter = segments[0];

    if (chapter !== 'pronouns') {
      router.push('/pronouns'); // Redirect to pronouns if chapter is not pronouns
      return;
    }

    setChapterName(chapter);

    const fetchChapterData = async () => {
      try {
        const res = await fetch(`/api/chapter/?chapter=${chapter}`);
        const data = await res.json();
        setChapterData(data);

        // Concatenate all pronoun categories
        const allPronouns = [
          ...(data[1]?.["Second Person Pronouns"] || []),
          ...(data[0]?.["First Person Pronouns"] || []),
          ...(data[2]?.["Third Person Pronouns"] || []),
        ].filter(pronoun => pronoun); // Filter out any undefined/null entries

        setPronouns(allPronouns);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      }
    };

    fetchChapterData();
  }, [pathname, isAuthenticated, isLoading, router]);

  if (!isAuthenticated || isLoading) {
    return null; // Redirect handled by useAuth
  }

  if (!pronouns || pronouns.length === 0) {
    return <div className="flex justify-center items-center mt-20">No data available</div>;
  }

  const currentPronoun = pronouns[currentPronounIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setCurrentPronounIndex((prev) => 
      prev + 1 < pronouns.length ? prev + 1 : 0
    );
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentPronounIndex((prev) => 
      prev - 1 >= 0 ? prev - 1 : pronouns.length - 1
    );
    setIsFlipped(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className='w-[80%] flex justify-self-center mt-8 mb-4 h-4 border rounded-full border-[var(--secondary)]'>
          <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * (currentPronounIndex + 1) / pronouns.length}%`}}></div>
      </div>
      <h1 className="text-2xl font-bold my-8">Flashcards</h1>

      <div 
        className="w-64 h-40 bg-white rounded-xl shadow-[0_0_10px_#00000055] flex items-center justify-center cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            transition: 'transform 0.5s', 
            transformStyle: 'preserve-3d', 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Side (Arabic) */}
          <div 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              backfaceVisibility: 'hidden' 
            }}
            className="bg-white rounded-xl flex items-center justify-center arabic text-3xl"
          >
            {currentPronoun.arabic}
          </div>
          {/* Back Side (English) */}
          <div 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)' 
            }}
            className="bg-white rounded-xl flex flex-col gap-y-6 items-center justify-center"
          >
            <div className='text-2xl font-medium'>
              {currentPronoun.english.split(" ").filter(word => !word.match(/^\([MF]\)$/)).join(" ")}
            </div>
            <div>
              <span className='bg-[#eeeeee] px-2 py-1 mx-1 rounded '>{currentPronoun.person}</span>
              <span className='bg-[#eeeeee] px-2 py-1 mx-1 rounded '>{currentPronoun.gender}</span>
              <span className='bg-[#eeeeee] px-2 py-1 mx-1 rounded '>{currentPronoun.type}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => router.push(`/${chapterName}`)}
        className="mt-4 text-[var(--primary)] hover:underline"
      >
        Back to {chapterName}
      </button>
    </div>
  );
}