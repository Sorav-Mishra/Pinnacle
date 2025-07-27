import { Schema, Document, models, model } from "mongoose";

// -------------------- Interface --------------------
export interface IUser extends Document {
  fullName: string;
  email: string;
  number: string;
  age: number;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

// -------------------- Schema Definition --------------------
const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name must be less than 100 characters"],
      match: [
        /^[a-zA-Z\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      ],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email must be less than 255 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },

    number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [15, "Phone number must be less than 15 digits"],
      match: [
        /^\+?[\d]+$/,
        "Phone number can only contain digits and optional + prefix",
      ],
      index: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [13, "Age must be at least 13"],
      max: [120, "Age must be less than 120"],
      validate: {
        validator: Number.isInteger,
        message: "Age must be a whole number",
      },
      index: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      required: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// -------------------- Model Export --------------------
const User = models.User || model<IUser>("User", UserSchema);
export default User;
