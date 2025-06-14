import connectDB from "@/lib/db";
import redis from "@/lib/redis";
import User from "@/models/user";
import transporter from "@/lib/mailer"

import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log(name, email, password)

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.verified) {
        return Response.json({ error: "User already exists!" }, { status: 400 });
      } else {
        // Not verified, update name and password
        existingUser.name = name;
        existingUser.password = hashedPassword;
        await existingUser.save();
      }
    } else {
      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        verified: false,
      });
      await newUser.save();
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 5 min expiry
    await redis.setex(`verify:${email}`, 300, code);

    // Send Email
    await transporter.sendMail({
        from: `"Fluentyx" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification Code",
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verify Your Email</h2>
            <p>Hi <b>${name}</b>,</p>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 4px;">${code}</h1>
            <p>This code will expire in 5 minutes.</p>
            </div>
        `,
    });

    return Response.json({
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
