import redis from "@/lib/redis";
import connectDB from "@/lib/db";


export async function GET(req) {
    try {
        await connectDB(); 
        await redis.set("test-key", "Hello Redis Cloud!");

    return new Response(JSON.stringify({msg: "hello"}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error}),
      { status: 400 }
    );
  }
}