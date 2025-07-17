import { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../../contexts/languageContext';

export function QToA({ chapter, index, setStep, isActive, data, step, setCorrectAttepmts, setWrongAttepmts }) {
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [hover, setHover] = useState(null);

  const { language } = useContext(LanguageContext)

  const handleClick = (opt, i) => {
    if (correctIndex !== null) return;
    if (opt.question_english === selectedExample.question_english) {
      setCorrectIndex(i);
      setStep(prev => prev + 1);
      setCorrectAttepmts(prev => prev + 1);
      setSelected(null);
      setCorrectIndex(null);
      setWrongIndex(null);
    } else {
      setWrongIndex(i);
      setWrongAttepmts(prev => prev + 1);
      setTimeout(() => {
        setWrongIndex(null);
        setSelected(null);
      }, 1000);
    }
    setSelected(i);
  };

     // Memoize the selection logic
    const { selectedExample, options } = useMemo(() => {
      if (!data || data.length === 0) return {};
      console.log(data)

      const current = data[index - 1]?.data;
      const all = [].concat(...data.map(item => item.data));
      
      if (current.length === 0 || all.length === 0) return {};

      const randomExampleIndex = Math.floor(Math.random() * current.length);
      const selectedExample = current[randomExampleIndex];

      const allOptions = all
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(4, all.length));

      if (!allOptions.some(opt => opt.question_english === current.question_english)) {
        allOptions[Math.floor(Math.random() * allOptions.length)] = selectedExample;
      }

      const options = allOptions.sort(() => 0.5 - Math.random());

      return { selectedExample, options };
    }, [data, index, step]);

  if (!selectedExample || !options) return null;
  console.log(selectedExample, options)

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center p-8 gap-y-16">
      <div className="bg-white md:mt-16 rounded-xl w-full max-w-md p-4 flex items-center justify-center shadow-[0_0_10px_#00000055] relative">
        <div className="flex gap-1 relative arabic">
          {
            selectedExample?.question?.split(" ").map((word, i) =>(
              <span
                className="px-1 arabic cursor-pointer"
                key={i}
                onMouseEnter={() => setHover(word)}
                onClick={() => setHover(word)}
                onMouseLeave={() => setHover(null)}
                >
                {word}
                </span>
            ))
          }
          <div className="absolute top-0 -translate-y-12 flex">
            {selectedExample?.word2word.map((word, i) => (
                <span 
                  className={`px-4 bg-[#eeeeee] rounded-lg flex flex-col text-sm text-center items-center ${(hover != word.arabic) && "invisible"}`} 
                  style={{fontSize: "12px !important"}} 
                  key={i} onMouseEnter={()=>{setHover(word)}} 
                  onMouseLeave={()=>{setHover(null)}}
                  onClick={()=>{setHover(word)}}>
                  
                    <p>
                        {language == 'english' ? word.english : word.urdu}
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

      <div className="grid grid-cols-2 gap-4 max-w-md font-medium">
        {
          options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleClick(opt, i)}
              className={`flex items-center justify-center border px-1 border-gray-300 aspect-[3/2] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer
                ${correctIndex === i ? 'bg-green-400 text-white' : wrongIndex === i ? 'bg-red-400 text-white' : 'bg-white'}
              `} >
              {opt?.answer}
            </div>  
          ))
        }
      </div>
    </div>
  );
}