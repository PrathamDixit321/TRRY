import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hackathon from "@/models/Hackathon";
import Team from "@/models/Team";

// GET /api/hackathons/[id]/teams — list teams for a hackathon
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const lookingForMembers = searchParams.get("looking");

    const query = { hackathon: id };
    if (lookingForMembers === "true") query.lookingForMembers = true;

    const teams = await Team.find(query)
      .populate("leader", "name username avatar")
      .populate("members.user", "name username avatar skills")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ teams });
  } catch (err) {
    console.error("GET /api/hackathons/[id]/teams error:", err);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}

// POST /api/hackathons/[id]/teams — create a team
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { name, leaderId, bio, projectIdea, techStack } = body;

    if (!name || !leaderId) {
      return NextResponse.json(
        { error: "Team name and leader are required" },
        { status: 400 },
      );
    }

    const hackathon = await Hackathon.findById(id);
    if (!hackathon)
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    if (
      !["registration_open", "upcoming", "ongoing"].includes(hackathon.status)
    ) {
      return NextResponse.json(
        { error: "Registration is not open" },
        { status: 400 },
      );
    }

    // Check leader is not already in a team for this hackathon
    const existingTeam = await Team.findOne({
      hackathon: id,
      "members.user": leaderId,
    });
    if (existingTeam) {
      return NextResponse.json(
        { error: "You are already in a team for this hackathon" },
        { status: 400 },
      );
    }

    const team = await Team.create({
      name,
      hackathon: id,
      leader: leaderId,
      members: [{ user: leaderId, role: "leader" }],
      bio,
      projectIdea,
      techStack: techStack || [],
    });

    await Hackathon.findByIdAndUpdate(id, { $inc: { registeredCount: 1 } });

    const populated = await team.populate([
      { path: "leader", select: "name username avatar" },
      { path: "members.user", select: "name username avatar" },
    ]);

    return NextResponse.json({ team: populated }, { status: 201 });
  } catch (err) {
    console.error("POST /api/hackathons/[id]/teams error:", err);
    return NextResponse.json(
      { error: "Failed to create team", details: err.message },
      { status: 500 },
    );
  }
}
