import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon";

// POST /api/teams/[id]/join — join via invite code
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId, inviteCode } = await request.json();

    if (!userId || !inviteCode) {
      return NextResponse.json(
        { error: "userId and inviteCode required" },
        { status: 400 },
      );
    }

    const team = await Team.findById(id).populate("hackathon");
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    if (team.inviteCode !== inviteCode.toUpperCase()) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 400 },
      );
    }

    const hackathon = team.hackathon;
    if (team.members.length >= hackathon.maxTeamSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 400 });
    }

    const alreadyIn = team.members.some((m) => m.user.toString() === userId);
    if (alreadyIn) {
      return NextResponse.json(
        { error: "You are already in this team" },
        { status: 400 },
      );
    }

    // Ensure user is not in another team for the same hackathon
    const otherTeam = await Team.findOne({
      hackathon: hackathon._id,
      "members.user": userId,
      _id: { $ne: id },
    });
    if (otherTeam) {
      return NextResponse.json(
        { error: "You are already in another team for this hackathon" },
        { status: 400 },
      );
    }

    team.members.push({ user: userId, role: "member" });
    if (team.members.length >= hackathon.maxTeamSize) {
      team.lookingForMembers = false;
    }
    await team.save();

    const populated = await team.populate([
      { path: "leader", select: "name username avatar" },
      { path: "members.user", select: "name username avatar" },
    ]);

    return NextResponse.json({ team: populated });
  } catch (err) {
    console.error("POST /api/teams/[id]/join error:", err);
    return NextResponse.json(
      { error: "Failed to join team", details: err.message },
      { status: 500 },
    );
  }
}
