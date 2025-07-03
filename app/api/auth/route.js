import jwt from "jsonwebtoken";
import { parse } from "cookie";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function GET(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.token || null;

    if (!token) {
      return new Response(JSON.stringify({ isAuthenticated: false, error: "No token provided" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.id).select("name email contact verified");

    if (!user) {
      return new Response(JSON.stringify({ isAuthenticated: false, error: "User not found" }), { status: 404 });
    }

    if (!user.verified) {
      return new Response(JSON.stringify({ isAuthenticated: false, error: "Account not verified" }), { status: 403 });
    }

    return new Response(
      JSON.stringify({
        isAuthenticated: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact || "",
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Auth Error:", err.message);
    return new Response(JSON.stringify({ isAuthenticated: false, error: err.message }), { status: 401 });
  }
}