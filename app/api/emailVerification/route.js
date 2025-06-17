import connectDB from "@/lib/db";
import redis from "@/lib/redis";
import User from "@/models/user";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
    
    // Create cookie
    const cookie = `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;

    const headers = new Headers();
    headers.append("Set-Cookie", cookie);

    return Response.json({ message: "Email verified successfully" }, { status: 200, headers });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
