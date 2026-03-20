import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Submission from "@/models/Submission";

// GET /api/hackathons/[id]/submissions — all submissions for a hackathon (admin/judge view)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track");
    const status = searchParams.get("status");
    const round = searchParams.get("round");

    const query = { hackathon: id };
    if (track) query.track = track;
    if (status) query.status = status;
    if (round) query.round = parseInt(round);

    const submissions = await Submission.find(query)
      .populate("team", "name members")
      .populate("submittedBy", "name username avatar")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ submissions, total: submissions.length });
  } catch (err) {
    console.error("GET /api/hackathons/[id]/submissions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
