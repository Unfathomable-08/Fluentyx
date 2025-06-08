// app/[chapter]/page.jsx
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export default async function ChapterPage({ params }) {
  const { chapter } = params;

  // Define the path to the chapter JSON file
  const chapterFilePath = path.join(
    process.cwd(),
    'data',
    chapter,
    'chapters.json'
  );

  try {
    // Read and parse the chapter JSON file
    const fileContent = await fs.readFile(chapterFilePath, 'utf-8');
    const chapterData = JSON.parse(fileContent);

    return (
      <main className="px-4 py-4 sm:px-16 md:px-20">
        <h1 className="text-xl font-bold text-center mb-4 text-[var(--secondary)]">{chapter.charAt(0).toUpperCase() + chapter.slice(1).toLowerCase()}</h1>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 px-4 py-4">
            {chapterData.map(ch => (
                <div className="w-full aspect-square arabic bg-white shadow-[0_0_10px_#00000055] rounded-lg flex juatify-center items-center">
                    <span>
                        { ch.letter }
                    </span>
                </div>
            ))}
        </div>
      </main>
    );
  } catch (error) {
    // Handle file not found or invalid JSON
    console.error(`Error loading chapter ${chapter}:`, error);
    return (
      <div className="px-6 py-20 text-center text-red-600 text-xl font-bold">
        Chapter not found!
      </div>
    );
  }
}