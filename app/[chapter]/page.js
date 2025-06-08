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
      <main className="px-6 py-20">
        <h1 className="text-3xl font-bold mb-6">{chapterData.title}</h1>

        <img
          src={chapterData.image}
          alt={chapterData.title}
          className="w-full max-w-2xl h-auto object-cover rounded-xl shadow-lg mb-8"
        />

        <p className="text-lg text-gray-700">
          This is the content for <strong>{chapter}</strong>.
          {/* Add more chapter-specific content here, e.g., chapterData.description */}
        </p>

        {/* Example: If chapter is 'alphabets', display alphabet list */}
        {chapter === 'alphabets' && chapterData.arabic_alphabets && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {chapterData.arabic_alphabets.map((alphabet, index) => (
              <div key={index} className="border p-4 rounded-lg text-center">
                <img
                  src={alphabet.image_url}
                  alt={alphabet.letter}
                  className="w-16 h-16 mx-auto mb-2"
                />
                <p className="text-xl font-semibold">{alphabet.letter}</p>
                <p className="text-sm text-gray-600">{alphabet.name}</p>
                <p className="text-sm text-gray-500">{alphabet.pronunciation}</p>
              </div>
            ))}
          </div>
        )}
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

// Generate static paths for known chapters (optional, for static generation)
export async function generateStaticParams() {
  // List of available chapters (folders in data/)
  const chaptersDir = path.join(process.cwd(), 'data');
  const chapterFolders = await fs.readdir(chaptersDir);

  return chapterFolders.map((chapter) => ({
    chapter,
  }));
}