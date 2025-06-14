"use client";

import { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi";

export default function ArabicReader({ text }) {
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith("ar"));
      setVoice(arabicVoice || voices[0]);
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const speak = () => {
    if (!text || !voice) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
    >
      <FiVolume2 className="text-lg" />
      <span>Read</span>
    </button>
  );
}
