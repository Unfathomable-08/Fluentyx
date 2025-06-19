import { useEffect, useState, useRef } from "react";

export function SelectCorrect({ chapter, index, setStep, data, isActive }) {
  const [randomWord, setRandomWord] = useState("");
  const [targetLetter, setTargetLetter] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const words = [
    "قمر", "كتاب", "مدرسة", "شجرة", "ولد", "بنت", "سماء", "نور", "بيت",
    "مكتب", "كلمة", "صوت", "عين", "رجل", "طفل", "باب", "ماء", "أسد", "نار",
    "قلب", "حمار", "حصان", "سيف", "زهر", "ضوء", "جمل", "ثوب", "رأس", "ذيل",
    "خروف", "دين", "لغة", "طريق", "علم", "عمل", "يد", "وجه", "أسرة", "ملك", "ظلم"
  ];

  useEffect(() => {
    if (index <= 0 || !data[index - 1]?.letter) return;

    const letter = data[index - 1].letter;
    setTargetLetter(letter);

    const matching = words.filter(w => w.includes(letter));
    const word = matching[Math.floor(Math.random() * matching.length)];
    setRandomWord(word || ""); // fallback

  }, [index, data]);

  const handleClick = (letter, i) => {
    setClickedIndex(i);
    const correct = letter === targetLetter;
    setIsCorrect(correct);
    if (correct) {
      setStep(prev => prev + 1);
      setClickedIndex(null);
      setIsCorrect(null)
    }
  };

  if (!isActive) return null;
  
  return (
    <div className="text-center p-4">
      <h1 className="text-xl font-bold mb-4">
        Click on <span className="text-[var(--secondary)]">{targetLetter}</span> in the following word.
      </h1>

      <div className="transform scale-170 my-16 flex justify-center items-center gap-4 flex-wrap arabic relative">
        <span className="w-28 border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] rounded-xl flex items-center justify-center">
            <div className="absolute z-50 text-black">
                {randomWord.split("").map((l, i) => (
                    <span key={i} onClick={() => handleClick(l, i)} className={`cursor-pointer ${clickedIndex == i && isCorrect ? 'text-green-500' : clickedIndex == i && !isCorrect ? 'text-red-500' : 'text-black'}`}>{l}</span>
                ))}
            </div>
        </span>
      </div>
    </div>
  );
}
