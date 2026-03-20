import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users — list all users
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users — create a new user
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      name,
      username,
      email,
      password,
      mobile,
      bio,
      role,
      skills,
      location,
      website,
      socialLinks,
    } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Name, username, email, and password are required." },
        { status: 400 },
      );
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.email === email
              ? "Email already registered."
              : "Username already taken.",
        },
        { status: 409 },
      );
    }

    // Normalise skills — accept "React, Node" string or ["React"] array
    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === "string" && skills.trim()
        ? skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const user = await User.create({
      name,
      username,
      email,
      password,
      ...(mobile && { mobile }),
      ...(bio && { bio }),
      ...(role && { role }),
      ...(location && { location }),
      ...(website && { website }),
      ...(socialLinks && { socialLinks }),
      skills: skillsArr,
    });

    // Return user without password field
    const safeUser = user.toObject();
    delete safeUser.password;

    return NextResponse.json(
      { message: "User created successfully.", user: safeUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/users] Error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { error: `${field} already exists.` },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: error.message, details: error.errors },
      { status: 500 },
    );
  }
}
