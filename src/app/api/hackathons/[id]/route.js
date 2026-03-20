import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hackathon from "@/models/Hackathon";

// GET /api/hackathons/[id] — by id or slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const hackathon = await Hackathon.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).populate("organizer", "name username avatar");

    if (!hackathon)
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    return NextResponse.json({ hackathon });
  } catch (err) {
    console.error("GET /api/hackathons/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch hackathon" },
      { status: 500 },
    );
  }
}

// PUT /api/hackathons/[id] — update
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const hackathon = await Hackathon.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );
    if (!hackathon)
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    return NextResponse.json({ hackathon });
  } catch (err) {
    console.error("PUT /api/hackathons/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update hackathon", details: err.message },
      { status: 500 },
    );
  }
}

// DELETE /api/hackathons/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const hackathon = await Hackathon.findByIdAndDelete(id);
    if (!hackathon)
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    return NextResponse.json({ message: "Hackathon deleted" });
  } catch (err) {
    console.error("DELETE /api/hackathons/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete hackathon" },
      { status: 500 },
    );
  }
}
