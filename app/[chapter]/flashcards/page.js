'use client';

import { useEffect, useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { FaHandPointer } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useSaveProgress from "../../../hooks/useSaveProgress";
import { LanguageContext } from '../../../contexts/languageContext'
import { HiSpeakerWave } from 'react-icons/hi2';

export default function Flashcards() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
  const [index, setIndex] = useState("flash");
  const [correctAttempts, setCorrectAttepmts] = useState(0);
  const [wrongAttempts, setWrongAttepmts] = useState(0);
  const [chapterData, setChapterData] = useState([]);
  const [pronouns, setPronouns] = useState([]);
  const [currentPronounIndex, setCurrentPronounIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userKnows, setUserKnows] = useState(false)

  const { language } = useContext(LanguageContext)

  const { saveProgress, isProgressLoading, error } = useSaveProgress();

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const segments = pathname.split('/').filter(Boolean);
    const chapter = segments[0];

    if (chapter == 'alphabets') {
      router.push('/alphabets'); // Redirect
      return;
    }

    setChapterName(chapter);

    const fetchChapterData = async () => {
      try {
        const res = await fetch(`/api/chapter/?chapter=${chapter}`);
        const data = await res.json();
        setChapterData(data);

        // Concatenate all pronoun categories
        let allPronouns;
        switch (chapter) {
          case "pronouns":
            allPronouns = [
              ...(data[1]?.["Second Person Pronouns"] || []),
              ...(data[0]?.["First Person Pronouns"] || []),
              ...(data[2]?.["Third Person Pronouns"] || []),
            ].filter(pronoun => pronoun);
            break;
          case "prepositions":
            allPronouns = [
              ...(data[0]?.["Attached Prepositions"] || []),
              ...(data[1]?.["Relational Prepositions"] || []),
              ...(data[2]?.["Temporal Prepositions"] || []),
              ...(data[3]?.["Spatial Prepositions"] || []),
              ...(data[4]?.["Specialized Prepositions"] || []),
            ];
            break;
          default:
            allPronouns = '';
        }

        setPronouns(allPronouns);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      }
    };

    fetchChapterData();
  }, [pathname, isAuthenticated, isLoading, router]);

  useEffect(()=>{
    if (pronouns.length !== 0 && userKnows){
      if ((currentPronounIndex + 1) == pronouns.length){
        console.log({user, chapterName, index, correctAttempts, wrongAttempts})
        saveProgress({ user, chapterName, index, correctAttempts, wrongAttempts });
        if (!error){
          router.push(`/${chapterName}`)
        }
      }
    }

  }, [currentPronounIndex, chapterName, index, user])

  if (!isAuthenticated || isLoading) {
    return null; // Redirect handled by useAuth
  }

  if (!pronouns || pronouns.length === 0) {
    return <div className="flex justify-center items-center mt-20">No data available</div>;
  }

  const currentPronoun = pronouns[currentPronounIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setUserKnows(true);
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

  const playSound = (arabic) => {
      const utterance = new SpeechSynthesisUtterance(arabic);
      utterance.lang = 'ar'; // Set language to Arabic
      window.speechSynthesis.speak(utterance); // Use Web Speech API to pronounce the pronoun
  };

  return (
    <div className="flex flex-col items-center  bg-[var(--bg-theme)]" style={{minHeight: 'calc(100vh - 50px)'}}>
      <div className='w-[80%] bg-white flex justify-self-center mb-4 h-4 border rounded-full border-[var(--secondary)] mt-14'>
          <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * (currentPronounIndex + 1) / pronouns.length}%`}}></div>
      </div>
      <h1 className="text-2xl font-bold my-8 text-[var(--text-theme)]">Flashcards</h1>

      <motion.div 
        className="w-64 h-40 bg-white rounded-xl shadow-[0_0_10px_#00000055] flex items-center justify-center cursor-pointer perspective-1000"
        onClick={handleFlip}
        animate={!isFlipped && !userKnows ? { scale: [1, 1.01, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
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
            className="bg-white rounded-xl relative flex items-center justify-center arabic text-3xl"
          >
            {currentPronoun.arabic}

            <motion.button
              className="text-2xl text-gray-700 hover:text-gray-900 absolute top-4 right-4"
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                playSound(currentPronoun.arabic);
              }}
            >
              <HiSpeakerWave />
            </motion.button>
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
              {language == 'english' ?
                currentPronoun.english.split(" ").filter(word => !word.match(/^\([MF]\)$/)).join(" ")
              :
                currentPronoun.hindi
              }
            </div>
            <div>
              {chapterName == "pronouns" && <span className='border border-[var(--secondary)] px-2 py-1 mx-1 rounded '>{currentPronoun.person}</span>}
              {chapterName == "pronouns" && <span className='border border-[var(--secondary)] px-2 py-1 mx-1 rounded '>{currentPronoun.gender}</span>}
              <span className='border border-[var(--secondary)] px-2 py-1 mx-1 rounded '>{currentPronoun.type}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {!isFlipped && !userKnows ? (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: [0.5, 1, 1, 0.5], y: [0, 15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut"
          }}
          className="mt-2 text-4xl transform -translate-y-8 translate-x-20 -rotate-20 text-[var(--primary)]"
        >
          <FaHandPointer />
        </motion.div>
      ) : ''}

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