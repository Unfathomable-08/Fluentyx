"use client"

import { useContext, useState } from 'react';
import { FaBell, FaCog, FaRegMoon, FaFire, FaTrophy, FaRobot, FaUser, FaHome } from 'react-icons/fa';
import { ThemeContext } from '../contexts/themeContext';
import { useScreenSize } from '../contexts/screenContext';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const { screenSize } = useScreenSize();
  const [focused, setFocused] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/auth') return null;

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-[var(--primary)] text-white shadow-md px-4 py-3 sm:px-12 md:px-20 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide flex items-center w-full relative">
          Fluentyx
        </div>

        {/* Top Navbar Icons */}
        {screenSize !== "xs" && (
          <div className="flex items-center md:gap-6 sm:gap-4 lg:gap-8 sm:text-xl md:text-2xl">
            <button
              onClick={() => router.push('/')}
              className="hover:text-white/80 transition"
              aria-label="Home"
            >
              <FaHome />
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="hover:text-white/80 transition"
              aria-label="Leaderboard"
            >
              <FaTrophy />
            </button>
            <button
              onClick={() => router.push('/ai')}
              className="hover:text-white/80 transition"
              aria-label="AI"
            >
              <FaRobot />
            </button>
            <button
              onClick={() => router.push('/account')}
              className="hover:text-white/80 transition"
              aria-label="Account"
            >
              <FaUser />
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Navbar for XS Screens */}
      {screenSize === "xs" && (
        <div className='fixed border-t-[10px] border-white bottom-0 w-full bg-[var(--primary)] z-50 text-white py-3 flex justify-evenly text-2xl'>
          <button
            className={`hover:text-white/80 transition p-[6px] ${focused === 'home' && 'active'}`}
            onClick={() => { setFocused('home'); router.push('/'); }}
            aria-label="Home"
          >
            <FaHome />
          </button>
          <button
            className={`hover:text-white/80 transition p-[6px] ${focused === 'leader' && 'active'}`}
            onClick={() => { setFocused('leader'); router.push('/leaderboard'); }}
            aria-label="Leaderboard"
          >
            <FaTrophy />
          </button>
          <button
            className={`hover:text-white/80 transition p-[6px] ${focused === 'ai' && 'active'}`}
            onClick={() => { setFocused('ai'); router.push('/ai'); }}
            aria-label="AI"
          >
            <FaRobot />
          </button>
          <button
            className={`hover:text-white/80 transition p-[6px] ${focused === 'account' && 'active'}`}
            onClick={() => { setFocused('account'); router.push('/account'); }}
            aria-label="Account"
          >
            <FaUser />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;