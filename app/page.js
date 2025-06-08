'use client';

import { useRouter } from 'next/navigation';
import chapters from '../data/chapters.json';

export default function Home() {
  const router = useRouter();

  const handleClick = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${slug}`);
  };

  return (
    <main className="px-4 py-4 md:px-20">
      <h1 className="text-2xl font-bold text-center mb-4">Chapters</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 px-4 py-4 gap-x-4 gap-y-8 overflow-x-auto pb-2">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => handleClick(ch.title)}
            className="w-full h-[200px] sm:h-[230px] md:h-[250px] border rounded-3xl overflow-hidden relative shadow-[0_0_20px_#00000055]"
          >
            <img
              src={ch.image}
              alt={ch.title}
              className="w-full h-full object-cover"
            />

            {/* Title */}
            <div className="absolute bottom-4 left-4 bg-gray-100/90 px-4 py-2 rounded-xl text-[var(--secondary)] text-lg font-semibold">
              {ch.title}
            </div>

            {/* Progress or Lock */}
            {!ch.unlocked && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                Locked
              </div>
            )}
            {ch.unlocked && ch.progress > 0 && (
              <div className="absolute top-4 right-4 bg-[var(--primary)] text-white text-sm px-3 py-1 rounded-full">
                {ch.progress}%
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
