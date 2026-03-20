import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["leader", "member"], default: "member" },
  joinedAt: { type: Date, default: Date.now },
});

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [MemberSchema],
    inviteCode: { type: String, unique: true },
    bio: { type: String },
    projectName: { type: String },
    projectIdea: { type: String },
    techStack: [{ type: String }],
    lookingForMembers: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["forming", "complete", "submitted", "disqualified"],
      default: "forming",
    },
  },
  { timestamps: true },
);

// Auto-generate invite code
TeamSchema.pre("save", async function () {
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

// Virtual: member count
TeamSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
