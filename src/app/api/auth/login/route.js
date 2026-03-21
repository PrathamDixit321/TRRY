import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// POST /api/auth/login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // MOCK LOGIN TO BYPASS MONGODB NETWORK BLOCK FOR SHOWCASE
    const safeUser = {
      _id: "mock_user_" + Date.now(),
      name: "Demo User",
      username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
      email: email,
      role: "student"
    };

    return NextResponse.json({ message: "Login successful (MOCKED).", user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
