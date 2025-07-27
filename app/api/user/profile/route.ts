// /app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { Types } from "mongoose";

// -------------------- Types --------------------
interface MongoUser {
  _id: Types.ObjectId;
  fullName?: string;
  email: string;
  number?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
}

interface UpdateProfileBody {
  email?: string;
  fullName?: string;
  city?: string;
  state?: string;
}

// -------------------- Helper Functions --------------------
function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
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

// -------------------- GET Handler --------------------
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] GET /api/user/profile`);

  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // console.warn(`[${requestId}] Unauthorized access attempt`);
      return createErrorResponse("Unauthorized", 401);
    }

    // Get email from query params or use session email
    const { searchParams } = new URL(request.url);
    const requestedEmail = searchParams.get("email");

    // Security: Users can only access their own profile
    if (requestedEmail && requestedEmail !== session.user.email) {
      //   console.warn(
      //     `[${requestId}] User ${session.user.email} attempted to access ${requestedEmail}'s profile`
      //   );
      return createErrorResponse("Access denied", 403);
    }

    const userEmail = requestedEmail || session.user.email;

    // Connect to database
    try {
      await connectDB();
    } catch {
      //console.error(`[${requestId}] Database connection failed:`, dbError);
      return createErrorResponse("Service temporarily unavailable", 503);
    }

    // Find user by email
    try {
      const user = await User.findOne({
        email: userEmail.toLowerCase(),
      }).lean<MongoUser>();

      if (!user) {
        // console.warn(`[${requestId}] User not found: ${userEmail}`);
        return createErrorResponse("User not found", 404);
      }

      // Update last login time
      await User.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      });

      // Format response data
      const profileData: UserProfileResponse = {
        id: user._id.toString(),
        fullName: user.fullName || "",
        email: user.email || "",
        number: user.number || "",
        age: user.age || 0,
        gender: user.gender || "",
        city: user.city || "",
        state: user.state || "",
        image: user.image || session.user.image || "",
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date(),
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
        isActive: user.isActive !== undefined ? user.isActive : true,
        lastLoginAt: user.lastLoginAt || new Date(),
      };

      //   console.log(
      //     `[${requestId}] Profile fetched successfully for: ${userEmail}`
      //   );
      return createSuccessResponse(
        profileData,
        "Profile data retrieved successfully"
      );
    } catch {
      // console.error(`[${requestId}] Database query error:`, queryError);
      return createErrorResponse("Failed to fetch profile data", 500);
    }
  } catch {
    // console.error(`[${requestId}] Unexpected error:`, unexpectedError);
    return createErrorResponse("Internal server error", 500);
  }
}

// -------------------- Update Profile Handler --------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  //console.log(`[${requestId}] POST /api/user/profile - Update profile`);

  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Parse request body
    let body: UpdateProfileBody;
    try {
      body = (await request.json()) as UpdateProfileBody;
    } catch {
      // console.error(`[${requestId}] JSON parse error:`, parseError);
      return createErrorResponse("Invalid JSON format", 400);
    }

    const { email, fullName, city, state } = body;

    // Security: Users can only update their own profile
    if (email && email !== session.user.email) {
      //   console.warn(
      //     `[${requestId}] User ${session.user.email} attempted to update ${email}'s profile`
      //   );
      return createErrorResponse("Access denied", 403);
    }

    // Validate input data
    if (
      fullName &&
      (typeof fullName !== "string" || fullName.trim().length < 2)
    ) {
      return createErrorResponse(
        "Full name must be at least 2 characters",
        400
      );
    }

    if (city && (typeof city !== "string" || city.trim().length < 2)) {
      return createErrorResponse("City must be at least 2 characters", 400);
    }

    if (state && (typeof state !== "string" || state.trim().length < 2)) {
      return createErrorResponse("State must be at least 2 characters", 400);
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error(`[${requestId}] Database connection failed:`, dbError);
      return createErrorResponse("Service temporarily unavailable", 503);
    }

    // Update user profile
    try {
      const updateData: Partial<MongoUser> = {
        updatedAt: new Date(),
      };

      if (fullName !== undefined) updateData.fullName = fullName.trim();
      if (city !== undefined) updateData.city = city.trim();
      if (state !== undefined) updateData.state = state.trim();

      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email.toLowerCase() },
        updateData,
        { new: true, runValidators: true }
      ).lean<MongoUser>();

      if (!updatedUser) {
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
    } catch (updateError: unknown) {
      // console.error(`[${requestId}] Database update error:`, updateError);

      // Handle validation errors
      if (
        updateError &&
        typeof updateError === "object" &&
        "name" in updateError &&
        updateError.name === "ValidationError"
      ) {
        const validationError = updateError as unknown as {
          errors: Record<string, { path: string; message: string }>;
        };
        const validationErrors = Object.values(validationError.errors).map(
          (err) => `${err.path}: ${err.message}`
        );
        return createErrorResponse(
          `Validation failed: ${validationErrors.join(", ")}`,
          400
        );
      }

      return createErrorResponse("Failed to update profile", 500);
    }
  } catch {
    //console.error(`[${requestId}] Unexpected error:`, unexpectedError);
    return createErrorResponse("Internal server error", 500);
  }
}

// -------------------- Other HTTP Methods --------------------
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to update profile." },
    {
      status: 405,
      headers: { Allow: "GET, POST" },
    }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to update profile." },
    {
      status: 405,
      headers: { Allow: "GET, POST" },
    }
  );
}
