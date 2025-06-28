import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSpeakerWave } from 'react-icons/hi2';

// EXERCISE: MatchPronounSound
export function MatchPronounSound({ chapter, index, data, setStep, isActive, setCorrectAttepmts, setWrongAttepmts }) {
    const [selected, setSelected] = useState(null);
    const [correctIndex, setCorrectIndex] = useState(null);
    const [wrongIndex, setWrongIndex] = useState(null);

    if (!data || data.length === 0) return null;

    // Map index to pronoun category
    let pronounCategories;
      switch (chapter) {
        case "pronouns":
          pronounCategories = {
            1: { key: "First Person Pronouns", data: data[0]?.["First Person Pronouns"] || [] },
            2: { key: "Second Person Pronouns", data: data[1]?.["Second Person Pronouns"] || [] },
            3: { key: "Third Person Pronouns", data: data[2]?.["Third Person Pronouns"] || [] },
          };
          break;
        case "prepositions":
          pronounCategories = {
            1: { key: "Attached Prepositions", data: data[0]?.["Attached Prepositions"] || [] },
            2: { key: "Relational Prepositions", data: data[1]?.["Relational Prepositions"] || [] },
            3: { key: "Temporal Prepositions", data: data[2]?.["Temporal Prepositions"] || [] },
            4: { key: "Specialized Prepositions", data: data[3]?.["Specialized Prepositions"] || [] },
          };
          break;
        default:
          pronounCategories = '';
      }

    // Get the pronoun category for the given index
    const currentCategory = pronounCategories[index];
    if (!currentCategory || !currentCategory.data || currentCategory.data.length === 0) return null;

    // Randomly select one pronoun from the current category
    const pronouns = currentCategory.data;
    const randomIndex = Math.floor(Math.random() * pronouns.length);
    const correct = pronouns[randomIndex];

    // Get all pronouns from other categories
    let otherData;
    switch (chapter) {
      case "pronouns":
        otherData = [
          ...(index !== 1 ? data[0]?.["First Person Pronouns"] || [] : []),
          ...(index !== 2 ? data[1]?.["Second Person Pronouns"] || [] : []),
          ...(index !== 3 ? data[2]?.["Third Person Pronouns"] || [] : []),
        ].filter(item => item?.id !== correct?.id);
        break;
      case "prepositions":
        otherData = [
          ...(index !== 1 ? data[0]?.["Attached Prepositions"] || [] : []),
          ...(index !== 2 ? data[1]?.["Relational Prepositions"] || [] : []),
          ...(index !== 3 ? data[2]?.["Temporal Prepositions"] || [] : []),
          ...(index !== 4 ? data[3]?.["Spatial Prepositions"] || [] : []),
          ...(index !== 5 ? data[4]?.["Specialized Prepositions"] || [] : []),
        ].filter(item => item?.id !== correct?.id);
        break;
      default:
        otherData = '';
    }

    // Get unique Arabic pronouns from otherData
    const uniqueOtherArabic = [...new Set(otherData.map(item => item.arabic))];

    // Select 3 random unique Arabic pronouns
    const selectedArabic = uniqueOtherArabic
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // For each selected Arabic pronoun, select one random pronoun
    const incorrect = selectedArabic.map(a => {
        const candidates = otherData.filter(item => item.arabic === a);
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    });

    // Create options by inserting the correct pronoun at a random position
    const options = [...incorrect];
    const insertAt = Math.floor(Math.random() * 4);
    options.splice(insertAt, 0, correct);

    const handleClick = (opt, i) => {
        if (correctIndex !== null) return; // Prevent further clicks after correct answer
        if (opt.arabic === correct.arabic) {
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
        const utterance = new SpeechSynthesisUtterance(correct.arabic);
        utterance.lang = 'ar'; // Set language to Arabic
        window.speechSynthesis.speak(utterance); // Use Web Speech API to pronounce the pronoun
    };

    if (!isActive) return null;

    return (
        <div className="flex flex-col items-center p-8 pt-12 gap-x-6 gap-y-16 relative">
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

            {/* Four Arabic Pronoun Options */}
            <div className="grid grid-cols-2 gap-4 w-[240px]">
                {options.map((opt, i) => {
                    const isCorrect = correctIndex !== null && opt.arabic === correct.arabic;
                    const isWrong = wrongIndex === i;
                    return (
                        <motion.div
                            key={i}
                            onClick={() => handleClick(opt, i)}
                            className={`text-xl font-bold flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer arabic
                                ${isCorrect ? 'bg-green-400 text-white' : ''}
                                ${isWrong ? 'bg-red-400 text-white' : ''}
                            `}
                            animate={isCorrect || isWrong ? { rotate: [-5, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {opt.arabic}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}