'use client';

import { useEffect, useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { FaUserAlt } from "react-icons/fa";
import useAuth from "../../../../hooks/useAuth";
import useSaveProgress from "../../../../hooks/useSaveProgress";
import { LanguageContext } from '../../../../contexts/languageContext'
import { HiSpeakerWave } from 'react-icons/hi2';

export default function Flashcards() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [chapterName, setChapterName] = useState('');
  const [index, setIndex] = useState("flash");
  const [correctAttempts, setCorrectAttepmts] = useState(25);
  const [wrongAttempts, setWrongAttepmts] = useState(0);
  const [chapterData, setChapterData] = useState([]);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1)

  const { language } = useContext(LanguageContext)

  const { saveProgress, isProgressLoading, error } = useSaveProgress();

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const segments = pathname.split('/').filter(Boolean);
    const chapter = segments[1];

    console.log(chapter)

    setChapterName(chapter);

    const fetchChapterData = async () => {
      try {
        const res = await fetch(`/api/chapter/?chapter=${chapter}`);
        const data = await res.json();
        setChapterData(data);
        console.log(data)

        // Concatenate all pronoun categories
        let allData = [].concat(...data.map(item => item.data));
        console.log(allData)
            
        setData(allData);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      }
    };

    fetchChapterData();
  }, [pathname, isAuthenticated, isLoading, router]);

  useEffect(()=>{
    if (data.length !== 0){
      if ((currentIndex + 1) == data.length){
        console.log({user, chapterName, index, correctAttempts, wrongAttempts})
        saveProgress({ user, chapterName, index, correctAttempts, wrongAttempts });
        if (!error){
          router.push(`/stage-2/${chapterName}`)
        }
      }
    }

  }, [currentIndex, chapterName, index, user])

  if (!isAuthenticated || isLoading) {
    return null; // Redirect handled by useAuth
  }

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev + 1 < data.length ? prev + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev - 1 >= 0 ? prev - 1 : data.length - 1
    );
  };

  const playSound = (arabic) => {
      const utterance = new SpeechSynthesisUtterance(arabic);
      utterance.lang = 'ar'; // Set language to Arabic
      window.speechSynthesis.speak(utterance); // Use Web Speech API to pronounce the pronoun
  };

  return (
    <div className="flex flex-col items-center mb-14 bg-[var(--bg-theme)]" style={{minHeight: 'calc(100vh - 50px)'}}>
      <div className='w-[80%] bg-white flex justify-self-center mb-4 h-4 border rounded-full border-[var(--secondary)] mt-6'>
          <div className="h-full rounded-full bg-[var(--primary)] max-w-[100%]" style={{width: `${100 * (currentIndex + 1) / data.length}%`}}></div>
      </div>
      { currentIndex == -1 ? 
        <div 
          className="w-72 h-48 p-4 text-center font-medium bg-white rounded-xl shadow-[0_0_10px_#00000055] flex items-center justify-center cursor-pointer perspective-1000"
        >
          {desc}        
        </div>
        :
        <>
          <div className="w-full flex flex-col gap-y-10 px-6 sm:px-12 md:px-20 py-6 max-w-2xl">
            {/* Question Bubble (User - right aligned) */}
            <div key={index} className="flex justify-end items-center gap-x-2">
              <div className="bg-[var(--primary)]/40 text-black px-3 rounded-xl max-w-[70%] text-right arabic">
                <span className="flex items-center gap-2 text-[18px]">
                  {data[currentIndex]?.question}
                </span>
              </div>
              <span className='absolute transform translate-y-9 pe-5'>
                {language == 'english' ? data[currentIndex]?.question_english : data[currentIndex]?.question_urdu}
              </span>
              <FaUserAlt />
            </div>
    
            {/* Answer Bubble (AI - left aligned) */}
            <div className="flex justify-start items-center gap-x-2">
              <FaUserAlt />
              <div className="bg-[var(--primary)]/40 text-black px-3 rounded-xl max-w-[70%] text-right arabic">
                <span className="flex items-center gap-2 text-[18px]">
                  {data[currentIndex]?.answer} 
                </span>
              </div>
              <span className='absolute transform translate-y-9 ps-6'>
                {language == 'english' ? data[currentIndex]?.answer_english : data[currentIndex]?.answer_urdu}
              </span>
            </div>
          </div>
    
          <div className='w-[80%] flex flex-col gap-y-1 transform scale-80 max-h-[240px] overflow-scroll'>
            {data[currentIndex]?.word2word.map((word, index) => (
              <div key={index} className='flex gap-x-4 w-full items-center justify-center border-1 border-gray-800'>
                <span className='arabic w-[25%] px-2'><b className='text-[16px]'>{word.arabic}</b></span>
                <span className='w-[25%]'>{language == 'english' ? word.english : word.urdu}</span>
                <span className='w-[25%]'>{word.pronounce}</span>
                <motion.button
                  className="w-[25%] text-2xl text-gray-700 hover:text-gray-900"
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(word.arabic);
                  }}
                  >
                  <HiSpeakerWave />
                  </motion.button>
                </div>
            ))}
          </div>
    
          <div className="flex gap-4">
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
        </>
      }
    </div>
  );
}
