import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    const { currentPassword, contact } = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.verified) {
      return Response.json({ error: "Account not verified" }, { status: 403 });
    }

    if (!currentPassword || !contact) {
      console.log("Missing fields:", { currentPassword, contact })
      return Response.json({ error: "Current password and contact are required" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    user.contact = contact;
    await user.save();

    return Response.json({ message: "Contact updated successfully", user }, { status: 200 });
  } catch (err) {
    console.error("Update Contact Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}