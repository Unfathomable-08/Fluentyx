import connectDB from "@/lib/db";
import redis from "@/lib/redis";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({ message: "Email and code are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const storedCode = await redis.get(`forgot-password:${email}`);

    if (!storedCode) {
      return Response.json({ message: "Verification code expired or not found" }, { status: 410 });
    }

    if (storedCode !== code) {
      return Response.json({ message: "Invalid verification code" }, { status: 400 });
    }

    // Clean up used code
    await redis.del(`forgot-password:${email}`);

    return Response.json({ message: "Verification successful" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Verification Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}