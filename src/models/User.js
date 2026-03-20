import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String },
  url: { type: String },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    mobile: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    avatar: { type: String, default: "" },
    location: { type: String },
    website: { type: String },
    role: {
      type: String,
      enum: ["developer", "designer", "fullstack", "other"],
      default: "developer",
    },
    skills: [{ type: String }],
    socialLinks: [SocialLinkSchema],
    projects: [ProjectSchema],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
