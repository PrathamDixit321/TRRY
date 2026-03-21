import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";
import bcrypt from "bcryptjs";

// POST /api/company/login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // MOCKED RESPONSE FOR SHOWCASE
    const safeCompany = {
      _id: "mock_id_12345",
      name: "Showcase Company",
      email,
      role: "company"
    };

    return NextResponse.json({
      message: "Login successful.",
      company: safeCompany,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
