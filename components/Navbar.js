"use client"

import { useContext, useState } from 'react';
import { FaBell, FaCog, FaRegMoon, FaFire, FaTrophy, FaRobot, FaUser, FaHome } from 'react-icons/fa';
import { ThemeContext } from '../contexts/themeContext';
import { useScreenSize } from '../contexts/screenContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { screenSize } = useScreenSize();
  const [focused, setFocused] = useState("home");
  const pathname = usePathname();

  if (pathname === '/auth') {
    return null;
  }
  
  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-[var(--primary)] text-white shadow-md px-4 py-3 sm:px-12 md:px-20 flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="text-xl font-bold tracking-wide flex justify-between items-center w-full">
          Fluentyx
          
          <div>
            <FaFire className="text-orange-500 transform -translate-x-6" size={26} />
          </div>
        </div>
  
        {/* Icons */}
        {screenSize != "xs" &&
          <div className="flex items-center md:gap-6 sm:gap-4 lg:gap-8 sm:text-xl md:text-2xl">
            <button className="hover:text-white/80 transition" aria-label="Notifications">
              <FaHome />
            </button>
            <button className="hover:text-white/80 transition" aria-label="Settings">
              <FaTrophy/>
            </button>
            <button className="hover:text-white/80 transition" aria-label="Settings">
              <FaRobot />
            </button>
            <button className="hover:text-white/80 transition" aria-label="Settings">
              <FaUser />
            </button>
          </div>
        }
      </nav>
       {screenSize == "xs" &&
          <div className='fixed border-t-[10px] border-white bottom-0 w-full bg-[var(--primary)] z-50 text-white px-4 py-3 flex justify-evenly text-2xl'>
            <button className={`hover:text-white/80 transition p-[6px] ${focused == 'home' && 'active'}`} onClick={()=>{ setFocused('home'); }} aria-label="Home">
              <FaHome />
            </button>
            <button className={`hover:text-white/80 transition p-[6px] ${focused == 'leader' && 'active'}`} onClick={()=>{ setFocused('leader'); }} aria-label="Leaderboard">
              <FaTrophy/>
            </button>
            <button className={`hover:text-white/80 transition p-[6px] ${focused == 'ai' && 'active'}`} onClick={()=>{ setFocused('ai'); }} aria-label="AI">
              <FaRobot />
            </button>
            <button className={`hover:text-white/80 transition p-[6px] ${focused == 'account' && 'active'}`} onClick={()=>{ setFocused('account'); }} aria-label="Account">
              <FaUser />
            </button>
          </div>
       }
    </>
  );
};

export default Navbar;
