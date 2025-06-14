import connectDB from "@/lib/db";
import redis from "@/lib/redis";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const storedCode = await redis.get(`verify:${email}`);

    if (!storedCode) {
      return Response.json({ error: "Verification code expired or not found" }, { status: 410 });
    }

    if (storedCode !== code) {
      return Response.json({ error: "Invalid verification code" }, { status: 400 });
    }

    user.verified = true;
    await user.save();

    await redis.del(`verify:${email}`); // Clean up used code

    return Response.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
