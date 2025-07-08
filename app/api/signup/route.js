import connectDB from "@/lib/db";
import redis from "@/lib/redis";
import User from "@/models/user";
import bcrypt from "bcrypt";
import transporter from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.verified) {
        return Response.json({ error: "Email is already registered and verified" }, { status: 409 });
      }
      // If user exists but is not verified, allow generating a new code
    }

    // Hash password if new user
    const hashedPassword = existingUser ? existingUser.password : await bcrypt.hash(password, 10);

    // Create or update user
    const user = existingUser || (await User.create({ email, password: hashedPassword, name, verified: false }));

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in Redis with 15-minute expiration
    await redis.set(`verify:${email}`, verificationCode, "EX", 5 * 60);

    // HTML email template
    const textTemplate = `
      Hello ${name},
      
      Thank you for signing up! Please use the following code to verify your email address:
      
      **${verificationCode}**
      
      This code is valid for 5 minutes. If you did not request this, please ignore this email.
      
      Best regards,
      Fluentyx Team
      
      © ${new Date().getFullYear()} Fluentyx. All rights reserved.
    `;

    // Send email using the imported transporter
    await transporter.sendMail({
      from: `"Your Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      text: textTemplate,
    });

    return Response.json({ message: "Verification code sent to your email" }, { status: 200 });
  } catch (err) {
    console.error("Signup Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
      }
