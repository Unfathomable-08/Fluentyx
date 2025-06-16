import jwt from "jsonwebtoken";
import { parse } from "cookie";

export async function GET(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    console.log("Parsed cookies:", cookies);
    const token = cookies.token || null;
    console.log("Extracted token:", token);

    if (!token) {
      console.log("No token found in cookies");
      return new Response(JSON.stringify({ isAuthenticated: false, error: "No token provided" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    return new Response(
      JSON.stringify({ isAuthenticated: true, user: decoded }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Auth Error:", err.message);
    return new Response(JSON.stringify({ isAuthenticated: false, error: err.message }), { status: 401 });
  }
}