import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

// POST /api/company/register
export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // MOCKED RESPONSE FOR SHOWCASE
    const safeCompany = {
      _id: "mock_id_" + Date.now(),
      name,
      email,
      role: "company"
    };

    return NextResponse.json(
      { message: "Company registered successfully.", company: safeCompany },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
