import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String },
    description: { type: String, required: true },
    problem: { type: String }, // problem being solved
    solution: { type: String }, // how it solves it
    repoUrl: { type: String },
    liveUrl: { type: String },
    videoUrl: { type: String },
    presentationUrl: { type: String }, // Google Slides / PDF
    techStack: [{ type: String }],
    screenshots: [{ type: String }], // image URLs
    track: { type: String }, // which hackathon track
    round: { type: Number, default: 1 },
    score: { type: Number },
    feedback: { type: String },
    ranking: { type: Number },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "shortlisted",
        "winner",
        "disqualified",
      ],
      default: "submitted",
    },
    submittedAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date },
  },
  { timestamps: true },
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
export default Submission;
