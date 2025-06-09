'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';



// EXERCISE NO. 01

export function ArToEn({ chapter, index, data, setStep }) {
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

        if (opt.pronounce === correct.pronounce) {
            setCorrectIndex(i); // Mark correct answer
            setStep(prev => prev + 1);
        } else {
            setWrongIndex(i); // Mark wrong answer
            setTimeout(() => {
                setWrongIndex(null); // Clear wrong selection after 1 second
                setSelected(null); // Allow another selection
            }, 1000);
        }
        setSelected(i); // Track the selected option
    };

    return (
        <div className="flex flex-col items-center p-8 gap-x-6 gap-y-16">
            {/* Top Arabic Letter */}
            <div className="bg-white md:mt-16 rounded-xl w-32 h-32 md:w-30 md:h-30 flex flex-col items-center justify-center shadow-[0_0_10px_#00000055] arabic">
                <span className="text-6xl font-bold">{correct.letter}</span>
            </div>

            {/* Four English Options */}
            <div className="grid grid-cols-2 gap-4 w-[240px]">
                {options.map((opt, i) => {
                    const isCorrect = correctIndex !== null && opt.pronounce === correct.pronounce;
                    const isWrong = wrongIndex === i;
                    return (
                        <motion.div
                            key={i}
                            onClick={() => handleClick(opt, i)}
                            className={`text-xl font-bold flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
                                ${isCorrect ? 'bg-green-400 text-white' : ''}
                                ${isWrong ? 'bg-red-400 text-white' : ''}
                            `}
                            animate={isCorrect || isWrong ? { rotate: [-5, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {opt.pronounce}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}




// EXERCISE NO. 02

export function EnToAr({chapter, index, data}){
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

        if (opt.pronounce === correct.pronounce) {
            setCorrectIndex(i); // Mark correct answer
            setStep(prev => prev + 1);
        } else {
            setWrongIndex(i); // Mark wrong answer
            setTimeout(() => {
                setWrongIndex(null); // Clear wrong selection after 1 second
                setSelected(null); // Allow another selection
            }, 1000);
        }
        setSelected(i); // Track the selected option
    };

    return (
        <div className="flex flex-col items-center p-8 gap-x-6 gap-y-16">
            {/* Top Arabic Letter */}
            <div className="bg-white md:mt-16 rounded-xl w-32 h-32 md:w-30 md:h-30 flex flex-col items-center justify-center shadow-[0_0_10px_#00000055]">
                <span className="text-3xl font-medium">{correct.pronounce}</span>
            </div>

            {/* Four English Options */}
            <div className="grid grid-cols-2 gap-4 w-[240px]">
                {options.map((opt, i) => {
                    const isCorrect = correctIndex !== null && opt.letter === correct.letter;
                    const isWrong = wrongIndex === i;
                    return (
                        <motion.div
                            key={i}
                            onClick={() => handleClick(opt, i)}
                            className={`arabic font-bold flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
                                ${isCorrect ? 'bg-green-400 text-white' : ''}
                                ${isWrong ? 'bg-red-400 text-white' : ''}
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




// EXERCISE NO. 03

export function Draw({chapter, index}){
    return (
        <div></div>
    )
}



// EXERCISE NO. 04

export function MatchSound({chapter, index}){
    return (
        <div></div>
    )
}



// EXERCISE NO. 05

export function SelectCorrect({chapter, index}){
    return (
        <div></div>
    )
}