import connectDB from "@/lib/db";
import User from "@/models/user";
import VerificationCode from "@/models/verificationCode"; 
import transporter from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in MongoDB 
    await VerificationCode.findOneAndUpdate(
      { email }, // Find by email
      { email, code, createdAt: new Date() }, // Update or set code and createdAt
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    // Send Email
    await transporter.sendMail({
      from: `"Fluentyx" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Hi <b>${user.name}</b>,</p>
          <p>Your password reset verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    return Response.json({
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}