'use client';

import { useRouter } from 'next/navigation';
import chapters from '../data/chapters.json';
import useAuth from "../hooks/useAuth";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [streak, setStreak] = useState(0);

  const router = useRouter();

  const handleClick = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${slug}`);
  };


  useEffect(() => {
    const getStreak = async () => {
      if (!user) return;
      const response = await fetch(`/api/streak?email=${user.email}`);
      const data = await response.json();
      console.log(data);
    };
    getStreak();
  }, [user]);

  // Function to get the current week's dates
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Move back to Sunday

    const weekDates = [];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        day: days[i],
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }

    return weekDates;
  };

  const weekDates = getWeekDates();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <main className="px-4 py-4 pb-20 md:px-20 bg-[var(--bg-theme)]" style={{minHeight: 'calc(100vh - 50px)'}}>
      {/* Daily Exercise */}
      <div className='px-4 py-4 justify-center flex flex-col gap-y-6 items-center'>
        <div
          className="w-full max-sm:max-w-[360px] max-sm:h-[120px] sm:h-[120px] border rounded-3xl overflow-hidden relative shadow-[0_0_20px_#00000055] flex justify-center items-center"
        >
          <div className='flex justify-evenly items-center w-full max-w-md'>
            {weekDates.map((dayInfo, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-semibold pb-2 text-[var(--text-theme)]">{dayInfo.day}</p>
                <p className="text-lg font-bold pb-2 text-[var(--text-theme)]">
                  {dayInfo.date}
                </p>
                <div className='border-2 border-orange-400 w-6 h-6 rounded-full flex justify-center items-center'>
                  <FaCheck className='text-orange-400 transform translate-y-[1px]'/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <motion.div 
          className='w-full max-sm:max-w-[360px] shadow-[0_0_12px_#00000055] hover:bg-[var(--secondary)] bg-[var(--primary)] text-white font-medium text-lg px-4 py-1 sm:py-2 rounded-3xl overflow-hidden relative flex justify-center items-center overflow-hidden'
        >
          <motion.div 
            className="absolute top-0 bg-[#b1e78c] w-40 h-full transform -skew-45"
            initial={{left: '-100%'}}
            animate={{left: '100%'}}
            transition={{duration: 3, delay: 3, repeat: Infinity, ease: 'linear'}}
          ></motion.div>
          <button className='relative z-5' onClick={() => router.push(`/dailyExercise`)}>
            Daily Challenge
          </button>
        </motion.div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-4 text-[var(--text-theme)]">Chapters</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 px-4 py-4 gap-x-4 justify-center gap-y-8 overflow-x-auto pb-2">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => handleClick(ch.title)}
            className="w-full max-sm:max-w-[430px] h-[200px] sm:h-[230px] md:h-[250px] border rounded-3xl overflow-hidden relative shadow-[0_0_20px_#00000055]"
          >
            <img
              src={ch.image}
              alt={ch.title}
              className="w-full h-full object-cover"
            />

            {/* Title */}
            <div className="absolute bottom-4 left-4 bg-gray-100/90 px-4 py-2 rounded-xl text-[var(--secondary)] text-lg font-semibold">
              {ch.title}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
