import React, { useState } from 'react';

export function PronounToAr({ chapter, index, data, setStep, isActive }) {
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);

  if (!data || data.length === 0) return null;

  // Flatten the dataset if it's nested
  const allPronouns = [
    ...data[index - 1]["First Person Pronouns"],
    ...data[1]["Second Person Pronouns"],
    ...data[2]["Third Person Pronouns"],
  ];

  const correct = allPronouns[index - 1];

  // Get other data with different English translations
  const otherData = allPronouns.filter(
    item => item.arabic !== correct.arabic && item.id !== correct.id
  );

  // Get unique English translations from otherData
  const uniqueOtherEnglish = [...new Set(otherData.map(item => item.arabic))];

  // Select 3 random unique English translations
  const selectedEnglish = uniqueOtherEnglish
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // For each selected English translation, select one random pronoun
  const incorrect = selectedEnglish.map(e => {
    const candidates = otherData.filter(item => item.arabic === e);
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
    } else {
      setWrongIndex(i); // Mark wrong answer
      setTimeout(() => {
        setWrongIndex(null); // Clear wrong selection after 1 second
        setSelected(null); // Allow another selection
      }, 1000);
    }
    setSelected(i); // Track the selected option
  };

  if (!isActive) return null;
  return (
    <div className="flex flex-col items-center p-8 gap-x-6 gap-y-16">
      {/* Top Arabic Pronoun */}
      <div className="bg-white md:mt-16 rounded-xl w-32 aspect-[5/4] md:w-30 flex flex-col items-center justify-center shadow-[0_0_10px_#00000055] arabic">
        <span className="text-6xl font-bold">{correct.english}</span>
      </div>

      {/* Four English Options */}
      <div className="grid grid-cols-2 gap-4 w-[240px]">
        {options.map((opt, i) => {
          const isCorrect = correctIndex !== null && opt.arabic === correct.arabic;
          const isWrong = wrongIndex === i;
          return (
            <div
              key={i}
              onClick={() => handleClick(opt, i)}
              className={`text-xl font-bold flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
                ${isCorrect ? 'bg-green-400 text-white' : ''}
                ${isWrong ? 'bg-red-400 text-white' : ''}
              `}
            >
              {opt.arabic}
            </div>
          );
        })}
      </div>
    </div>
  );
}