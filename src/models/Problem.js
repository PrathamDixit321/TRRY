import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: {
      type: String,
      required: true,
      enum: ["AI", "Web3", "DevOps", "HealthTech", "FinTech", "EdTech", "IoT", "Cybersecurity", "Sustainability", "Other"],
    },
    expectedOutcome: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "closed", "reviewing"],
      default: "open",
    },
    solutionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);

export default Problem;
