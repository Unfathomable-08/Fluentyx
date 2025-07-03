import { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/languageContext'

export function PronounToAr({ chapter, index, data, setStep, isActive, setCorrectAttepmts, setWrongAttepmts }) {
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);

  const { language } = useContext(LanguageContext)

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
        4: { key: "Spatial Prepositions", data: data[3]?.["Spatial Prepositions"] || [] },
        5: { key: "Specialized Prepositions", data: data[4]?.["Specialized Prepositions"] || [] },
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
        ...(index !== 4 ? data[3]?.["Specialized Prepositions"] || [] : []),
      ];
      break;
    default:
      otherData = '';
  }

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
      setCorrectAttepmts(prev => prev + 1);
      setSelected(null);
      setWrongIndex(null);
      setCorrectIndex(null);
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

  if (!isActive) return null;
  return (
    <div className="flex flex-col items-center p-8 gap-x-6 gap-y-16">
      {/* Top Arabic Pronoun */}
      <div className="bg-white md:mt-16 rounded-xl w-32 aspect-[5/4] md:w-30 flex flex-col items-center justify-center shadow-[0_0_10px_#00000055]">
        <span className="font-medium text-2xl text-center">{language == 'english' ? correct.english : correct.hindi}</span>
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
              className={`flex items-center justify-center text-center border border-gray-300 aspect-[5/4] arabic shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
                ${isCorrect ? 'bg-green-400 text-white' : isWrong ? 'bg-red-400 text-white' : 'bg-white'}
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