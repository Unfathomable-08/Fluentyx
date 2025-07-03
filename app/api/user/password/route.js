import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    const { currentPassword, newPassword } = await req.json();
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

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    if (newPassword.length < 8) {
      return Response.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return Response.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Update Password Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}