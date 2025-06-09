import { useEffect, useState } from "react";

export function SelectCorrect({ chapter, index, setStep, data }) {
  const [randomWord, setRandomWord] = useState("");
  const [targetLetter, setTargetLetter] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const words = [
    "قمر", "كتاب", "مدرسة", "شجرة", "ولد", "بنت", "سماء", "نور", "بيت",
    "مكتب", "كلمة", "صوت", "عين", "رجل", "طفل", "باب", "ماء", "أسد", "نار",
    "قلب", "حمار", "حصان", "سيف", "زهر", "ضوء", "جمل", "ثوب", "رأس", "ذيل",
    "خروف", "دين", "لغة", "طريق", "علم", "عمل", "يد", "وجه", "أسرة", "ملك"
  ];

  useEffect(() => {
    if (index <= 0 || !data[index - 1]?.letter) return;

    const letter = data[index - 1].letter;
    setTargetLetter(letter);

    const matching = words.filter(w => w.includes(letter));
    const word = matching[Math.floor(Math.random() * matching.length)];
    setRandomWord(word || ""); // fallback

    console.log('w', word)
  }, [index, data]);

  const handleClick = (letter, i) => {
    setClickedIndex(i);
    setIsCorrect(letter === targetLetter);
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-xl font-bold mb-4">
        Click on <span className="text-blue-600">{targetLetter}</span> in the following word
      </h1>

      <div className="text-4xl flex justify-center gap-4 flex-wrap arabic">
        {randomWord}
      </div>
    </div>
  );
}
