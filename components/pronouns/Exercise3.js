import { useState } from 'react';

export function FillBlank({ chapter, index, setStep, isActive, selectedExample, correctPronoun, sentenceWithBlank, selectedWord2Word, options }) {
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [hover, setHover] = useState(null);

  if (!isActive || !selectedExample || !correctPronoun || !sentenceWithBlank || !selectedWord2Word || !options) return null;

  const handleClick = (opt, i) => {
    if (correctIndex !== null) return;
    if (opt.arabic === correctPronoun.arabic) {
      setCorrectIndex(i);
      setStep(prev => prev + 1);
    } else {
      setWrongIndex(i);
      setTimeout(() => {
        setWrongIndex(null);
        setSelected(null);
      }, 1000);
    }
    setSelected(i);
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center p-8 gap-y-16">
      <div className="bg-white md:mt-16 rounded-xl w-full max-w-md p-4 flex items-center justify-center shadow-[0_0_10px_#00000055] relative">
        <div className="flex gap-1 relative">
          {sentenceWithBlank.split(" ").map((word, i) => (
            <span
              className="px-1 arabic"
              key={i}
              onMouseEnter={() => setHover(word)}
              onMouseLeave={() => setHover(null)}
            >
              {word}
            </span>
          ))}
          <div className="absolute top-0 -translate-y-12 flex">
            {selectedWord2Word.map((word, i) => (
                <span className={`px-4 bg-[#eeeeee] rounded-lg flex flex-col text-sm text-center justify-center items-center ${hover != word.word && "invisible"}`} style={{fontSize: "12px !important"}} key={i} onmouseenter={()=>{setHover(word)}} onmouseleave={()=>{setHover(null)}}>
                    <p>
                        {word.translate}
                    </p>
                    <p>
                        {word.pronounce}
                    </p>
                    <span className="w-0 h-0 absolute bottom-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#eeeeee] transform translate-y-2"></span>
                </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-[240px] arabic">
        {options.map((opt, i) => {
          const isCorrect = correctIndex !== null && opt.arabic === correctPronoun.arabic;
          const isWrong = wrongIndex === i;
          return (
            <div
              key={i}
              onClick={() => handleClick(opt, i)}
              className={`flex items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
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