"use client";

import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../contexts/themeContext";
import { LanguageContext } from "../../contexts/languageContext";
import { FaEdit, FaSun, FaMoon } from "react-icons/fa";
import { MdEmail, MdPhone, MdPassword } from "react-icons/md";
import useAuth from "../../hooks/useAuth"

export default function AccountPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);

  if (!isAuthenticated){
    return null;
  }

  return (
    <div className={`bg-[var(--bg-theme)] min-h-[calc(100vh - 50px)] py-8 px-4 flex flex-col items-center`}>
      {/* Circle Avatar and Name */}
      <motion.div
        className="flex flex-col items-center gap-2 mb-8"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-[0_5px_10px_#00000055] bg-white`}>
          {user?.name[0]?.toUpperCase()}
        </div>
        <h1 className={`text-2xl ${theme == 'dark' ? 'text-[var(--text-theme)]' : 'text-black'} font-semibold`}>{user?.name}</h1>
      </motion.div>

      {/* Details Box */}
      <motion.div
        className={`${theme == 'dark' ? 'bg-white/80' : 'bg-white'} w-full max-w-md rounded-2xl p-6 shadow-[0_0_10px_#00000055] transition-all duration-300`}
      >
        {/* Email */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MdEmail className="text-xl text-[var(--primary)]" />
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MdPhone className="text-xl text-[var(--primary)]" />
            <p>{user?.contact ? user.contact : 'Add Contact'}</p>
          </div>
          <FaEdit className="cursor-pointer text-gray-500 hover:text-[var(--primary)]" title="Edit Contact" />
        </div>

        {/* Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdPassword className="text-xl text-[var(--primary)]" />
            <p>{"*".repeat(8)}</p>
          </div>
          <FaEdit className="cursor-pointer text-gray-500 hover:text-[var(--primary)]" title="Edit Password" />
        </div>
      </motion.div>

      {/* Theme Toggle */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => toggleTheme()}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md bg-[var(--primary)] text-white transition hover:scale-105"
        >
          {theme == 'dark' ? <FaSun /> : <FaMoon />}
          {theme == 'dark' ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Language Toggle */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className={`${theme == 'dark' ? 'text-[var(--text-theme)]' : 'text-black'} text-lg font-semibold mb-2`}>Select Language</h2>
        <div className="flex gap-4">
          {["english", "hindi"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-2 rounded-full transition ${
                language === lang
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-black border border-gray-600"
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
