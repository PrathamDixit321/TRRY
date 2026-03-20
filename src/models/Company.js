import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    industry: { type: String, default: "" },
    description: { type: String, default: "" },
    role: { type: String, default: "company" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CompanySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

CompanySchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

CompanySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default Company;
