export function ArToEn({ chapter, index, data }) {
  if (!data || data.length === 0) return null;

  const correct = data[index - 1];
  
  // Pick 3 random incorrect options
  const shuffled = data
    .filter((_, i) => i !== index)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Insert correct at random position
  const options = [...shuffled];
  const insertAt = Math.floor(Math.random() * 4);
  options.splice(insertAt, 0, correct);

  console.log(options)

  return (
    <div className="flex flex-col items-center p-6 gap-x-6 gap-y-16">
      {/* Top Arabic Letter */}
      <div className="arabic bg-white rounded-xl w-32 h-32 flex flex-col items-center justify-center shadow-[0_0_10px_#00000055] arabic">
        <span className="text-6xl font-bold">{correct.letter}</span>
      </div>

      {/* Four English Options */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((opt, i) => (
          <div
            key={i}
            className="bg-white text-xl arabic flex items-center justify-center border border-gray-300 aspect-[2/1] shadow-[0_0_10px_#00000055] text-center rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            {opt.pronounce}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnToAr({chapter, index, data}){
    return (
        <div></div>
    )
}

export function Draw({chapter, index}){
    return (
        <div></div>
    )
}

export function MatchSound({chapter, index}){
    return (
        <div></div>
    )
}

export function SelectCorrect({chapter, index}){
    return (
        <div></div>
    )
}