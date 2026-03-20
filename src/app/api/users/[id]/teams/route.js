import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";

// GET /api/users/[id]/teams — all teams a user belongs to
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const teams = await Team.find({ "members.user": id })
      .populate("leader", "name username avatar _id")
      .populate("members.user", "name username avatar")
      .populate("hackathon", "title slug status _id")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ teams });
  } catch (err) {
    console.error("GET /api/users/[id]/teams error:", err);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
