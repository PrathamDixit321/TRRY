import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon";

// GET /api/teams/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const team = await Team.findById(id)
      .populate("leader", "name username avatar bio skills")
      .populate("members.user", "name username avatar bio skills")
      .populate("hackathon", "title slug status maxTeamSize");

    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json({ team });
  } catch (err) {
    console.error("GET /api/teams/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}

// PUT /api/teams/[id] — update team details
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      bio,
      projectName,
      projectIdea,
      techStack,
      lookingForMembers,
    } = body;

    const team = await Team.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          bio,
          projectName,
          projectIdea,
          techStack,
          lookingForMembers,
        },
      },
      { new: true },
    );
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json({ team });
  } catch (err) {
    console.error("PUT /api/teams/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
}
