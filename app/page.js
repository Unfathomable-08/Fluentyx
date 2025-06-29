'use client';

import { useRouter } from 'next/navigation';
import chapters from '../data/chapters.json';
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();

  const router = useRouter();

  const handleClick = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${slug}`);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  return (
    <main className="px-4 py-4 pb-20 md:px-20 bg-[var(--bg-theme)]" style={{minHeight: 'calc(100vh - 50px)'}}>
      <h1 className="text-2xl font-bold text-center mb-4 text-[var(--text-theme)]">Chapters</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 px-4 py-4 gap-x-4 justify-center gap-y-8 overflow-x-auto pb-2">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => handleClick(ch.title)}
            className="w-full max-sm:max-w-[430px] h-[200px] sm:h-[230px] md:h-[250px] border rounded-3xl overflow-hidden relative shadow-[0_0_20px_#00000055]"
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
          </div>
        ))}
      </div>
    </main>
  );
}
