import { useState, useEffect } from 'react';

export default function CircularProgress({totalTime, radius, stroke, fontSize, getProgress, setParentProgress, completedFn}) {
  const [progress, setProgress] = useState(0);
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // Seconds
      setProgress(elapsed);
      if (elapsed >= totalTime) {
        clearInterval(interval);
        completedFn()
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (getProgress){
      setParentProgress(progress);
    }
  }, [getProgress])

  const strokeDashoffset = circumference - (progress / totalTime) * circumference;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: radius*2 }}>
      <svg width={radius * 2.5} height={radius * 2.5}>
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={radius * 1.25}
          cy={radius * 1.25}
        />
        <circle
          stroke="#4caf50"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={radius * 1.25}
          cy={radius * 1.25}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <text x={radius * 1.25} y={radius * 1.25} textAnchor="middle" dy=".3em" fontSize={fontSize}>
          {`0${Math.floor(progress / 60)}:${Math.floor(progress % 60) < 10 ? `0${Math.round(progress % 60)}` : Math.round(progress % 60)}`}
        </text>
      </svg>
    </div>
  );
}