import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hackathon from "@/models/Hackathon";

// GET /api/hackathons — list with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const mode = searchParams.get("mode") || "";
    const skip = (page - 1) * limit;

    const query = { isPublished: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
        { theme: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (status) query.status = status;
    if (mode) query.mode = mode;

    const [hackathons, total] = await Promise.all([
      Hackathon.find(query)
        .select("-guidelines -judgingCriteria -rounds")
        .sort({ hackathonStart: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Hackathon.countDocuments(query),
    ]);

    return NextResponse.json({
      hackathons,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /api/hackathons error:", err);
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
      { status: 500 },
    );
  }
}

// POST /api/hackathons — create hackathon (organizer only)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      title,
      tagline,
      description,
      organizer,
      organizerName,
      theme,
      tags,
      mode,
      location,
      registrationStart,
      registrationEnd,
      hackathonStart,
      hackathonEnd,
      submissionDeadline,
      minTeamSize,
      maxTeamSize,
      maxParticipants,
      prizes,
      totalPrizePool,
      eligibility,
      guidelines,
      judgingCriteria,
      rounds,
      website,
      contactEmail,
      bannerImage,
      logoImage,
      isPublished,
    } = body;

    if (
      !title ||
      !description ||
      !organizer ||
      !hackathonStart ||
      !hackathonEnd ||
      !registrationEnd ||
      !submissionDeadline
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const exists = await Hackathon.findOne({ slug: baseSlug });
    const slug = exists ? `${baseSlug}-${Date.now()}` : baseSlug;

    const hackathon = await Hackathon.create({
      title,
      slug,
      tagline,
      description,
      organizer,
      organizerName,
      theme,
      tags,
      mode,
      location,
      registrationStart,
      registrationEnd,
      hackathonStart,
      hackathonEnd,
      submissionDeadline,
      minTeamSize: minTeamSize || 1,
      maxTeamSize: maxTeamSize || 4,
      maxParticipants,
      prizes: prizes || [],
      totalPrizePool,
      eligibility,
      guidelines,
      judgingCriteria: judgingCriteria || [],
      rounds: rounds || [],
      website,
      contactEmail,
      bannerImage,
      logoImage,
      status: isPublished ? "upcoming" : "draft",
      isPublished: !!isPublished,
    });

    return NextResponse.json({ hackathon }, { status: 201 });
  } catch (err) {
    console.error("POST /api/hackathons error:", err);
    return NextResponse.json(
      { error: "Failed to create hackathon", details: err.message },
      { status: 500 },
    );
  }
}
