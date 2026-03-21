import mongoose from "mongoose";

const StudentProblemStatementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      enum: ["Web3", "AI/ML", "Fintech", "HealthTech", "EdTech", "Cybersecurity", "Other"],
      default: "Other",
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "evaluating"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const StudentProblemStatement =
  mongoose.models.StudentProblemStatement ||
  mongoose.model("StudentProblemStatement", StudentProblemStatementSchema);

export default StudentProblemStatement;
