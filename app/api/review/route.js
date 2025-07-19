import { NextResponse } from "next/server";
import transporter from "@/lib/mailer"

export async function POST(request) {
  try {
    const { email, type, message, rating } = await request.json();

    // Validate required fields
    if (!email || !type || !message) {
      return NextResponse.json(
        { message: "Email, type, and message are required" },
        { status: 400 }
      );
    }

    // Send email
    await transporter.sendMail({
        from: `"Fluentyx" <${process.env.EMAIL_USER}>`,
        to: "muhammad124711@gmail.com",
        subject: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Submission`,
        html: `
          <h2>New ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Rating:</strong> ${rating || "Not provided"}</p>
        `
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { message: "Failed to submit feedback", message: error.message },
      { status: 500 }
    );
  }
}