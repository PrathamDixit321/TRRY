import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Support lookup by username or MongoDB id
    const query = id.length === 24 ? { _id: id } : { username: id };
    const user = await User.findOne(query).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/users/[id] — update user profile
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Don't allow password or email change via this route
    const { password, email, ...updateData } = body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ message: "User updated.", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);
    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
