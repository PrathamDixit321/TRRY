import mongoose from "mongoose";

const PrizeSchema = new mongoose.Schema({
  place: { type: String }, // "1st", "2nd", "3rd"
  title: { type: String },
  amount: { type: String }, // e.g. "₹50,000" or "$1000"
  description: { type: String },
});

const RoundSchema = new mongoose.Schema({
  name: { type: String }, // "Idea Submission", "Prototype", "Final"
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: false },
});

const HackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: { type: String },
    description: { type: String, required: true },
    bannerImage: { type: String, default: "" },
    logoImage: { type: String, default: "" },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizerName: { type: String },
    theme: { type: String }, // "AI", "Web3", "HealthTech"
    tags: [{ type: String }],
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },
    location: { type: String }, // for offline/hybrid
    registrationStart: { type: Date },
    registrationEnd: { type: Date, required: true },
    hackathonStart: { type: Date, required: true },
    hackathonEnd: { type: Date, required: true },
    submissionDeadline: { type: Date, required: true },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 4 },
    maxParticipants: { type: Number }, // null = unlimited
    prizes: [PrizeSchema],
    totalPrizePool: { type: String },
    rounds: [RoundSchema],
    eligibility: { type: String }, // "Open to all", "Students only"
    guidelines: { type: String },
    judgingCriteria: [{ type: String }],
    status: {
      type: String,
      enum: [
        "draft",
        "upcoming",
        "registration_open",
        "ongoing",
        "judging",
        "completed",
      ],
      default: "draft",
    },
    registeredCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    website: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true },
);

const Hackathon =
  mongoose.models.Hackathon || mongoose.model("Hackathon", HackathonSchema);
export default Hackathon;