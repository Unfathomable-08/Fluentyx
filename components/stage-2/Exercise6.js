import { useEffect, useMemo, useState } from 'react';
import exercise from '../../data/ai-exercise.json';

export default function AiExercise({
  chapter,
  index,
  setStep,
  isActive,
  data,
  step,
  setCorrectAttepmts,
  setWrongAttepmts,
}) {
  
  const question = useMemo(() => {
    const chapterData = exercise.find((item) => item.name === chapter);
    const random = Math.floor(Math.random() * chapterData.data.length);
    return chapterData.data[random].question;
  }, [chapter, step])
  
  // State to manage the user's input
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://unfathomable08-fluentyx-langweb.hf.space/evaluate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          user_answer: userAnswer
        }),
      });

      const result = await response.json();
      const score = result?.answer?.score?.split("/")[0];
      const feedback = result?.answer?.feedback;
      setScore(score);
      setFeedback(feedback);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to evaluate answer');
      }

      // Clear the input after submission
      setUserAnswer('');
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setCorrectAttepmts((prev) => prev + score);
    setStep((prev) => prev + 1);
    setUserAnswer('');
    setScore(null);
    setFeedback(null);
  }

  if (!isActive) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-8 gap-y-6 mb-14">
      <h2 className="font-medium">Answer in your own words</h2>
      <div className="bg-white md:mt-16 rounded-xl w-full max-w-md p-4 flex items-center justify-center shadow-[0_0_10px_#00000055] relative">
        <div className="flex gap-1 relative arabic">
          <span className="text-[28px]">{question}</span>
        </div>
      </div>
      <div className="w-full mt-10">
        <input
          type="text"
          className="border border-gray-500 rounded-xl px-4 py-2 w-full"
          placeholder="Type your answer here"
          value={userAnswer}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <button
          className="bg-[var(--primary)] text-white px-6 py-2 rounded-xl"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          className={`hove:bg-[var(--primary)] border-2 ${score == null ? 'border-gray-600 text-gray-600' : 'border-[var(--primary)] text-[var(--secondary)]'} px-6 py-[6px] rounded-xl ml-4`}
          onClick={handleNext}
          disabled={score == null}
        >
          {score == null || score > 5 ? 'Next' : 'Skip'}
        </button>
      </div>
      {score && (
        <div className="bg-white rounded-xl w-full max-w-md p-4 items-center justify-center shadow-[0_0_10px_#00000055] relative">
          <p className={score < 5 ? 'text-red-500 font-medium' : 'text-blue-500 font-medium'}>
            <span className='font-medium text-[var(--secondary)]'>Score: </span>{score}/10
          </p>
          <p>
            <span className='font-medium text-[var(--secondary)]'>Feedback: </span>{feedback}
          </p>
        </div>
      )}
    </div>
  );
}