import chapters from '../data/chapters.json';

export default function Home() {
  return (
    <main className="px-4 py-20 sm:px-8 md:px-20">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 overflow-x-auto pb-2">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="w-full h-[380px] rounded-3xl overflow-hidden relative shadow-xl"
          >
            <img
              src={ch.image}
              alt={ch.title}
              className="w-full h-full object-cover"
            />

            {/* Title */}
            <div className="absolute bottom-4 left-4 bg-white/80 px-4 py-2 rounded-xl text-[var(--primary)] text-lg font-semibold">
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
