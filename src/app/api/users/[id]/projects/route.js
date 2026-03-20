import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// POST /api/users/[id]/projects — add a project to a user
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await request.json();

    if (!project.title) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $push: { projects: project } },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json(
      { message: "Project added.", user },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/users/[id]/projects?projectId=xxx — remove a project
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId)
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 },
      );

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { projects: { _id: projectId } } },
      { new: true },
    ).select("-password");

    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ message: "Project removed.", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
