import connectDB from "@/lib/db";
import User from "@/models/user";
import VerificationCode from "@/models/verificationCode";

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

    // Clean up used code
    await VerificationCode.deleteOne({ email });

    return Response.json({ message: "Verification successful" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Verification Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}