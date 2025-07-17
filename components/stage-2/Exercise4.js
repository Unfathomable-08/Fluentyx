import { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../../contexts/languageContext';

export function QenToAentranslate({ chapter, index, setStep, isActive, data, step, setCorrectAttepmts, setWrongAttepmts }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [isQuestionState, setIsQuestionState] = useState(null);
  const { language } = useContext(LanguageContext);

  const { selectedExample, words, isQuestion } = useMemo(() => {
    if (!data || data.length === 0) return {};

    const current = data[index - 1]?.data;
    if (!current || current.length === 0) return {};

    const randomExampleIndex = Math.floor(Math.random() * current.length);
    const selectedExample = current[randomExampleIndex];

    // Randomly decide whether to use question or answer
    const isQuestion = Math.random() > 0.5;
    setIsQuestionState(isQuestion);
    const targetText = language == 'english' ?
      isQuestion ? selectedExample.question_english : selectedExample.answer_english
      :
      isQuestion ? selectedExample.question_urdu : selectedExample.answer_urdu
    const targetWords = targetText.split(' ');

    // Generate extra words (3-4) from other items in data
    const allWords = language == 'english' ?
      [].concat(...data.map(item => item.data.map(d => (
      isQuestion ? d.question_english : d.answer_english).split(' '))).flat())
      :
      [].concat(...data.map(item => item.data.map(d => (
      isQuestion ? d.question_urdu : d.answer_urdu).split(' '))).flat())
    
    const extraWords = allWords
      .filter(word => !targetWords.includes(word))
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 3); // 3 or 4 extra words

    // Combine target words with extra words and shuffle
    const words = [...new Set([...targetWords, ...extraWords])].sort(() => 0.5 - Math.random());

    return { selectedExample, words, isQuestion };
  }, [data, index, step]);

  if (!selectedExample || !words) return null;

  const handleWordClick = (word, i) => {
    if (correctIndex !== null) return;

    const targetText = language == 'english' ?
      isQuestion ? selectedExample.question_english : selectedExample.answer_english
      :
      isQuestion ? selectedExample.question_urdu : selectedExample.answer_urdu
      
    const correctWords = targetText.split(' ');

    if (selectedWords.length < correctWords.length) {
      setSelectedWords(prev => [...prev, word]);

      // Check if the current sequence is correct so far
      const currentSequence = [...selectedWords, word].join(' ');
      const correctSequence = correctWords.slice(0, selectedWords.length + 1).join(' ');

      if (currentSequence === correctSequence && selectedWords.length + 1 === correctWords.length) {
        setCorrectIndex(i);
        setCorrectAttepmts(prev => prev + 1);
        setTimeout(() => {
          setStep(prev => prev + 1);
          setSelectedWords([]);
          setCorrectIndex(null);
          setWrongIndex(null);
        }, 1500);
      } else if (currentSequence !== correctSequence) {
        setWrongIndex(i);
        setWrongAttepmts(prev => prev + 1);
        setTimeout(() => {
          setSelectedWords([]);
          setWrongIndex(null);
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    if (correctIndex === null) return;
    setStep(prev => prev + 1);
    setSelectedWords([]);
    setCorrectIndex(null);
    setWrongIndex(null);
  };

  const handleReset = () => {
    setSelectedWords([]);
    setCorrectIndex(null);
    setWrongIndex(null);
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center p-8 pb-20 gap-y-6">
      <div className="bg-white md:mt-16 rounded-xl w-full max-w-md p-4 flex items-center justify-center shadow-[0_0_10px_#00000055] relative">
        <div className="flex gap-2 relative font-medium arabic">
          {isQuestion ?
            selectedExample?.question?.split(" ")?.map((word, i) => (
            <span key={i} className="py-2 rounded text-[20px]">
              {word}
            </span>
          ))
            :
            selectedExample?.answer?.split(" ")?.map((word, i) => (
            <span key={i} className="py-2 rounded">
              {word}
            </span>
          ))
          }
        </div>
      </div>

      <div className='flex gap-x-1'>
          {isQuestion ?
            selectedExample?.question_english?.split(" ")?.map((word, i) => (
            <span key={i} className="py-2 rounded text-[20px]">
              {selectedWords[i] ? selectedWords[i] : '_____'}
            </span>
          ))
            :
            selectedExample?.answer_english?.split(" ")?.map((word, i) => (
            <span key={i} className="py-2 rounded text-[20px]">
              {selectedWords[i] ? selectedWords[i] : '_____'}
            </span>
          ))
          }
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md">
        {words.map((word, i) => (
          <div
            key={i}
            onClick={() => handleWordClick(word, i)}
            className={`flex items-center text-[18px] justify-center border px-1 py-2 border-gray-300 aspect-[2/1] shadow-[0_0_10px_#00000055] text-center rounded-xl cursor-pointer
              ${correctIndex === i ? 'bg-green-500 text-white' : wrongIndex === i ? 'bg-red-500 text-white' : selectedWords.includes(word) ? 'bg-gray-500 text-white' : 'bg-white'}
            `}
          >
            {word}
          </div>
        ))}
      </div>

      <div className='flex gap-x-4'>
        <button
          onClick={handleReset}
          className={`mt-4 px-6 py-2 rounded-xl text-white font-medium bg-[var(--primary)] cursor-pointer`}
        >
          Reset
        </button>
        <button
          onClick={handleNext}
          className={`mt-4 px-6 py-2 rounded-xl text-white font-medium ${correctIndex !== null ? 'bg-[var(--primary)] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={correctIndex === null}
        >
          Next
        </button>
      </div>
    </div>
  );
}