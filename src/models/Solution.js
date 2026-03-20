import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String },
    solutionText: { type: String, required: true },
    repoUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    techStack: [{ type: String }],
    aiScore: { type: Number, default: 0, min: 0, max: 100 },
    aiFeedback: { type: String, default: "" },
    status: {
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

const Solution =
  mongoose.models.Solution || mongoose.model("Solution", SolutionSchema);

export default Solution;
