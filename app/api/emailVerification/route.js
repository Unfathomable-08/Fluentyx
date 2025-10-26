import connectDB from "@/lib/db";
import User from "@/models/user";
import VerificationCode from "@/models/verificationCode"; 
import jwt from "jsonwebtoken";

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

    // Check verification code in MongoDB
    const verification = await VerificationCode.findOne({ email, code });

    if (!verification) {
      return Response.json({ message: "Verification code expired or not found" }, { status: 410 });
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    // Clean up the used verification code
    await VerificationCode.deleteOne({ email });

    // Generate JWT
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
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
