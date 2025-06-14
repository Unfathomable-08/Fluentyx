import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.verified) {
      return Response.json({ error: "Account not verified" }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Create cookie
    const cookie = `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;

    const headers = new Headers();
    headers.append("Set-Cookie", cookie);

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
