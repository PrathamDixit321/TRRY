import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon";

// GET /api/teams/[id]/submissions
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const submissions = await Submission.find({ team: id })
      .populate("submittedBy", "name username")
      .sort({ submittedAt: -1 });
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("GET /api/teams/[id]/submissions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

// POST /api/teams/[id]/submissions — submit project
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const {
      userId,
      hackathonId,
      title,
      tagline,
      description,
      problem,
      solution,
      repoUrl,
      liveUrl,
      videoUrl,
      presentationUrl,
      techStack,
      screenshots,
      track,
      round,
    } = body;

    if (!userId || !hackathonId || !title || !description) {
      return NextResponse.json(
        { error: "userId, hackathonId, title, description are required" },
        { status: 400 },
      );
    }

    const [team, hackathon] = await Promise.all([
      Team.findById(id),
      Hackathon.findById(hackathonId),
    ]);
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    if (!hackathon)
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );

    // Check submission deadline
    if (new Date() > new Date(hackathon.submissionDeadline)) {
      return NextResponse.json(
        { error: "Submission deadline has passed" },
        { status: 400 },
      );
    }

    // Upsert: one submission per team per hackathon per round
    const submission = await Submission.findOneAndUpdate(
      { team: id, hackathon: hackathonId, round: round || 1 },
      {
        $set: {
          submittedBy: userId,
          title,
          tagline,
          description,
          problem,
          solution,
          repoUrl,
          liveUrl,
          videoUrl,
          presentationUrl,
          techStack: techStack || [],
          screenshots: screenshots || [],
          track,
          round: round || 1,
          status: "submitted",
          submittedAt: new Date(),
          lastEditedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    // Mark team as submitted
    await Team.findByIdAndUpdate(id, { status: "submitted" });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    console.error("POST /api/teams/[id]/submissions error:", err);
    return NextResponse.json(
      { error: "Failed to submit project", details: err.message },
      { status: 500 },
    );
  }
}
