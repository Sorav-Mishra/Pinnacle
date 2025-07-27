// /app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Types } from "mongoose";

// -------------------- Validation Schema --------------------
const UpdateProfileSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "City can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "State can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),
});

// -------------------- Types --------------------
interface UserDocument {
  _id: Types.ObjectId;
  fullName?: string;
  email: string;
  number?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isActive?: boolean;
  lastLoginAt?: Date;
}

interface UserProfileResponse {
  id: string;
  fullName: string;
  email: string;
  number: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  details?: string[];
}

interface UpdateProfileData {
  email: string;
  fullName?: string;
  city?: string;
  state?: string;
}

interface UserUpdateData {
  updatedAt: Date;
  fullName?: string;
  city?: string;
  state?: string;
}

interface SanitizedRequestBody {
  email?: string;
  fullName?: string;
  city?: string;
  state?: string;
  [key: string]: unknown;
}

interface MongooseValidationError {
  name: "ValidationError";
  errors: Record<string, { path: string; message: string }>;
}

interface MongoDuplicateKeyError {
  code: 11000;
  keyValue?: Record<string, unknown>;
}

// -------------------- Helper Functions --------------------
function createErrorResponse(
  error: string,
  status: number = 400,
  details?: string[]
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

// Type guard functions
function isMongooseValidationError(
  error: unknown
): error is MongooseValidationError {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "ValidationError" &&
    "errors" in error &&
    typeof error.errors === "object" &&
    error.errors !== null
  );
}

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  );
}

// -------------------- POST Handler --------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  // console.log(`[${requestId}] POST /api/user/update-profile`);

  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // console.warn(`[${requestId}] Unauthorized access attempt`);
      return createErrorResponse("Unauthorized", 401);
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      //console.error(`[${requestId}] Invalid JSON:`, error);
      return createErrorResponse("Invalid JSON format", 400);
    }

    // Validate input data
    let validatedData: UpdateProfileData;
    try {
      // Pre-process strings to sanitize input
      if (typeof body === "object" && body !== null) {
        const sanitizedBody: SanitizedRequestBody = {
          ...body,
        } as SanitizedRequestBody;

        // Sanitize string fields
        (["fullName", "city", "state"] as const).forEach((field) => {
          if (typeof sanitizedBody[field] === "string") {
            sanitizedBody[field] = sanitizeInput(sanitizedBody[field]);
          }
        });

        body = sanitizedBody;
      }

      validatedData = UpdateProfileSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn(`[${requestId}] Validation error:`, error.errors);
        return createErrorResponse(
          "Validation failed",
          400,
          error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
        );
      }
      throw error;
    }

    // Security: Users can only update their own profile
    if (validatedData.email !== session.user.email) {
      console.warn(
        `[${requestId}] User ${session.user.email} attempted to update ${validatedData.email}'s profile`
      );
      return createErrorResponse("Access denied", 403);
    }

    // Connect to database
    try {
      await connectDB();
    } catch {
      // console.error(`[${requestId}] Database connection failed:`, error);
      return createErrorResponse("Service temporarily unavailable", 503);
    }

    // Update user profile
    try {
      const updateData: UserUpdateData = {
        updatedAt: new Date(),
      };

      // Only update fields that are provided
      if (validatedData.fullName !== undefined) {
        updateData.fullName = validatedData.fullName;
      }
      if (validatedData.city !== undefined) {
        updateData.city = validatedData.city;
      }
      if (validatedData.state !== undefined) {
        updateData.state = validatedData.state;
      }

      const updatedUser = (await User.findOneAndUpdate(
        { email: session.user.email.toLowerCase() },
        updateData,
        {
          new: true,
          runValidators: true,
          select: "-__v",
        }
      ).lean()) as UserDocument | null;

      if (!updatedUser) {
        console.warn(`[${requestId}] User not found: ${session.user.email}`);
        return createErrorResponse("User not found", 404);
      }

      // Format response data
      const profileData: UserProfileResponse = {
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        number: updatedUser.number || "",
        age: updatedUser.age || 0,
        gender: updatedUser.gender || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        image: updatedUser.image || session.user.image || "",
        createdAt: updatedUser.createdAt || new Date(),
        updatedAt: updatedUser.updatedAt || new Date(),
        emailVerified: updatedUser.emailVerified || false,
        phoneVerified: updatedUser.phoneVerified || false,
        isActive:
          updatedUser.isActive !== undefined ? updatedUser.isActive : true,
        lastLoginAt: updatedUser.lastLoginAt || new Date(),
      };

      //   console.log(
      //     `[${requestId}] Profile updated successfully for: ${session.user.email}`
      //   );
      return createSuccessResponse(profileData, "Profile updated successfully");
    } catch (error: unknown) {
      //console.error(`[${requestId}] Database update error:`, error);

      // Handle validation errors
      if (isMongooseValidationError(error)) {
        const validationErrors = Object.values(error.errors).map(
          (err) => `${err.path}: ${err.message}`
        );
        return createErrorResponse(
          "Database validation failed",
          400,
          validationErrors
        );
      }

      // Handle duplicate key error
      if (isDuplicateKeyError(error)) {
        const duplicateField = Object.keys(error.keyValue || {})[0];
        return createErrorResponse(
          `A user with this ${duplicateField} already exists`,
          409
        );
      }

      return createErrorResponse("Failed to update profile", 500);
    }
  } catch {
    // console.error(`[${requestId}] Unexpected error:`, error);
    return createErrorResponse("Internal server error", 500);
  }
}

// -------------------- Other HTTP Methods --------------------
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to update profile." },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to update profile." },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to update profile." },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );
}
