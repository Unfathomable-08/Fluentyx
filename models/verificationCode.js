import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL index: expires after 300 seconds (5 minutes)
});

export default mongoose.models.VerificationCode || mongoose.model("VerificationCode", verificationCodeSchema);