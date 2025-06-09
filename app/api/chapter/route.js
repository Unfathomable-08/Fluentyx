import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const chapter = searchParams.get('chapter');

  if (!chapter) {
    return new Response(JSON.stringify({ error: 'Chapter query is required.' }), {
      status: 400,
    });
  }

  const filePath = path.join(process.cwd(), 'data', chapter, 'chapters.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error reading file for chapter ${chapter}:`, error);
    return new Response(
      JSON.stringify({ error: 'Chapter not found or invalid data.' }),
      { status: 404 }
    );
  }
}
