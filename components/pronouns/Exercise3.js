import { useState, useMemo } from 'react';

export function FillBlank({ chapter, index, setStep, isActive, data, step, setCorrectAttepmts, setWrongAttepmts }) {
  const [selected, setSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [hover, setHover] = useState(null);

  
  const handleClick = (opt, i) => {
    if (correctIndex !== null) return;
    if (opt.arabic === correctPronoun.arabic) {
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
    const { selectedExample, correctPronoun, sentenceWithBlank, selectedWord2Word, options } = useMemo(() => {
      if (!data || data.length === 0) return {};
  
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
  
      const currentCategory = pronounCategories[index];
      if (!currentCategory || !currentCategory.data || currentCategory.data.length === 0) return {};
  
      const pronouns = currentCategory.data;
      const allExamples = pronouns.flatMap(pronoun => pronoun.examples);
      if (allExamples.length === 0) return {};
  
      const randomExampleIndex = Math.floor(Math.random() * allExamples.length);
      const selectedExample = allExamples[randomExampleIndex];
  
      const correctPronoun = pronouns.find(pronoun =>
        pronoun.examples.some(example => example.id === selectedExample.id && example.sentence === selectedExample.sentence)
      );
      if (!correctPronoun) return {};
  
      const sentenceWithBlank = selectedExample.sentence.replace(correctPronoun.arabic, '____');
      const selectedWord2Word = selectedExample.word2word;
  
      const pronounOptions = pronouns
        .filter(pronoun => pronoun.person === correctPronoun.person)
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(4, pronouns.length));
  
      if (!pronounOptions.some(opt => opt.arabic === correctPronoun.arabic)) {
        pronounOptions[Math.floor(Math.random() * pronounOptions.length)] = correctPronoun;
      }
  
      const options = pronounOptions.sort(() => 0.5 - Math.random());
  
      return { selectedExample, correctPronoun, sentenceWithBlank, selectedWord2Word, options };
    }, [data, index, step]);
  
    if (!selectedExample || !correctPronoun) return null;

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center p-8 gap-y-16">
      <div className="bg-white md:mt-16 rounded-xl w-full max-w-md p-4 flex items-center justify-center shadow-[0_0_10px_#00000055] relative">
        <div className="flex gap-1 relative">
          {sentenceWithBlank.split(" ").map((word, i) => (
            <span
              className="px-1 arabic cursor-pointer"
              key={i}
              onMouseEnter={() => setHover(word)}
              onClick={() => setHover(word)}
              onMouseLeave={() => setHover(null)}
            >
              {word}
            </span>
          ))}
          <div className="absolute top-0 -translate-y-12 flex">
            {selectedWord2Word.map((word, i) => (
                <span className={`px-4 bg-[#eeeeee] rounded-lg flex flex-col text-sm text-center items-center ${hover != word.word && "invisible"}`} style={{fontSize: "12px !important"}} key={i} onMouseEnter={()=>{setHover(word)}} onMouseLeave={()=>{setHover(null)}} onClick={()=>{setHover(word)}}>
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
              className={`flex bg-white items-center justify-center border border-gray-300 aspect-[5/4] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer 
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