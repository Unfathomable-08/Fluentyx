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
    await redis.set(`verify:${email}`, verificationCode, "EX", 15 * 60);

    // HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .code { font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Our Platform!</h2>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for signing up! Please use the following 6-digit code to verify your email address:</p>
            <div class="code">${verificationCode}</div>
            <p>This code is valid for 15 minutes. If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Your Platform Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using the imported transporter
    await transporter.sendMail({
      from: `"Your Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: htmlTemplate,
    });

    return Response.json({ message: "Verification code sent to your email" }, { status: 200 });
  } catch (err) {
    console.error("Signup Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
      }
