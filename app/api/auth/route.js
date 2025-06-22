import jwt from "jsonwebtoken";
import { parse } from "cookie";

export async function GET(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");

    const token = cookies.token || null;

    if (!token) {
      return new Response(JSON.stringify({ isAuthenticated: false, error: "No token provided" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return new Response(
      JSON.stringify({ isAuthenticated: true, user: decoded }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Auth Error:", err.message);
    return new Response(JSON.stringify({ isAuthenticated: false, error: err.message }), { status: 401 });
  }
}