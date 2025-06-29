// EXERCISE: 04

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSpeakerWave } from 'react-icons/hi2';

// EXERCISE: MatchSound
export function MatchSound({ chapter, index, data, setStep, isActive, setCorrectAttepmts, setWrongAttepmts }) {
    const [selected, setSelected] = useState(null);
    const [correctIndex, setCorrectIndex] = useState(null);
    const [wrongIndex, setWrongIndex] = useState(null);

    if (!data || data.length === 0) return null;

    const correct = data[index - 1];

    // Pick 3 random incorrect options, ensuring correct answer is excluded
    const shuffled = data
        .filter((item, i) => i !== index - 1) // Exclude the correct answer
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // Insert correct answer at random position
    const options = [...shuffled];
    const insertAt = Math.floor(Math.random() * 4);
    options.splice(insertAt, 0, correct);

    const handleClick = (opt, i) => {
        if (correctIndex !== null) return; // Prevent further clicks after correct answer

        if (opt.letter === correct.letter) {
            setCorrectIndex(i); // Mark correct answer
            setStep(prev => prev + 1);
            setCorrectAttepmts(prev => prev + 1);
            setSelected(null);
            setCorrectIndex(null);
            setWrongIndex(null);
        } else {
            setWrongIndex(i); // Mark wrong answer
            setWrongAttepmts(prev => prev + 1);
            setTimeout(() => {
                setWrongIndex(null); // Clear wrong selection after 1 second
                setSelected(null); // Allow another selection
            }, 1000);
        }
        setSelected(i); // Track the selected option
    };

    const playSound = () => {
        const utterance = new SpeechSynthesisUtterance(correct.letter);
        utterance.lang = 'ar'; // Set language to Arabic
        window.speechSynthesis.speak(utterance); // Use Web Speech API to pronounce the letter
    };

    if (!isActive) return null;

    return (
        <div className="flex flex-col items-center p-8 gap-x-6 gap-y-16 relative">

            {/* Skip Button */}
            <div className="flex justify-end absolute right-6 top-1 font-medium text-[12px] text-red-600 underline">
                <span onClick={()=>{setSelected(null); setCorrectIndex(null); setWrongIndex(null); setStep(prev => prev + 1)}}>Skip</span>
            </div>

            {/* Speaker Icon */}
            <div className="bg-white md:mt-16 rounded-xl w-32 aspect-[5/4] md:w-30 flex items-center justify-center shadow-[0_0_10px_#00000055]">
                <motion.button
                    onClick={playSound}
                    className="text-6xl text-gray-700 hover:text-gray-900"
                    whileTap={{ scale: 0.9 }}
                >
                    <HiSpeakerWave />
                </motion.button>
            </div>

            {/* Four Arabic Letter Options */}
            <div className="grid grid-cols-2 gap-4 w-[240px]">
                {options.map((opt, i) => {
                    const isCorrect = correctIndex !== null && opt.letter === correct.letter;
                    const isWrong = wrongIndex === i;
                    return (
                        <motion.div
                            key={i}
                            onClick={() => handleClick(opt, i)}
                            className={`text-3xl font-bold flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer arabic
                                ${isCorrect ? 'bg-green-400 text-white' : isWrong ? 'bg-red-400 text-white' : 'bg-white'}
                            `}
                            animate={isCorrect || isWrong ? { rotate: [-5, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {opt.letter}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}