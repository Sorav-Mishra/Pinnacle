import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/clientPromise";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

// -------------------- Types --------------------
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

// Interface for database updates that includes NextAuth compatibility
interface UserUpdateData extends Partial<UserProfileResponse> {
  name?: string; // For NextAuth compatibility
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// -------------------- Response Helpers --------------------
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // console.log(`[${requestId}] No session found`);
      return createErrorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const requestedEmail = searchParams.get("email");

    if (requestedEmail && requestedEmail !== session.user.email) {
      // console.log(`[${requestId}] Access denied for email: ${requestedEmail}`);
      return createErrorResponse("Access denied", 403);
    }

    const userEmail = requestedEmail || session.user.email;
    //  console.log(`[${requestId}] Fetching profile for: ${userEmail}`);

    const client = await clientPromise;
    const db = client.db();

    // Find user with case-insensitive email search
    const user = await db
      .collection("users")
      .findOne({ email: { $regex: new RegExp(`^${userEmail}$`, "i") } });

    if (!user) {
      // console.log(`[${requestId}] User not found for email: ${userEmail}`);
      return createErrorResponse("User not found", 404);
    }

    //  console.log(`[${requestId}] Raw user data from database:`, {
    //     id: user._id.toString(),
    //     email: user.email,
    //     fullName: user.fullName,
    //     name: user.name,
    //     number: user.number,
    //     age: user.age,
    //     gender: user.gender,
    //     city: user.city,
    //     state: user.state,
    //     image: user.image,
    //     emailVerified: user.emailVerified,
    //     phoneVerified: user.phoneVerified,
    //     isActive: user.isActive,
    //     createdAt: user.createdAt,
    //     updatedAt: user.updatedAt,
    //     lastLoginAt: user.lastLoginAt,
    //   });

    // Update last login time
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Construct profile data with proper fallbacks and data type handling
    const profileData: UserProfileResponse = {
      id: user._id.toString(),
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      number: user.number || "",
      age: (() => {
        if (typeof user.age === "number") return user.age;
        if (typeof user.age === "string") {
          const parsed = parseInt(user.age, 10);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      })(),
      gender: user.gender || "",
      city: user.city || "",
      state: user.state || "",
      image: user.image || session.user?.image || "",
      createdAt: user.createdAt || user._id.getTimestamp(),
      updatedAt: user.updatedAt || new Date(),
      emailVerified: Boolean(user.emailVerified),
      phoneVerified: Boolean(user.phoneVerified),
      isActive: user.isActive !== undefined ? Boolean(user.isActive) : true,
      lastLoginAt: user.lastLoginAt || new Date(),
    };

    // console.log(`[${requestId}] Final profile data being sent:`, {
    //   id: profileData.id,
    //   fullName: profileData.fullName,
    //   email: profileData.email,
    //   number: profileData.number,
    //   age: profileData.age,
    //   gender: profileData.gender,
    //   city: profileData.city,
    //   state: profileData.state,
    //   image: profileData.image,
    //   emailVerified: profileData.emailVerified,
    //   phoneVerified: profileData.phoneVerified,
    //   isActive: profileData.isActive,
    //   createdAt: profileData.createdAt,
    //   updatedAt: profileData.updatedAt,
    //   lastLoginAt: profileData.lastLoginAt,
    // });

    return createSuccessResponse(
      profileData,
      "Profile data retrieved successfully"
    );
  } catch {
    //console.error(`[${requestId}] Unexpected error:`, error);
    return createErrorResponse("Internal server error", 500);
  }
}

// -------------------- POST Handler (for updates) --------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] POST /api/user/profile`);

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createErrorResponse("Unauthorized", 401);
    }

    let body: {
      fullName?: string;
      number?: string;
      age?: number;
      gender?: string;
      city?: string;
      state?: string;
    };
    try {
      body = await request.json();
    } catch {
      return createErrorResponse("Invalid JSON format", 400);
    }

    const updateData: UserUpdateData = {
      updatedAt: new Date(),
    };

    if (body.fullName !== undefined) {
      const fullName = body.fullName.trim();
      if (fullName.length < 2) {
        return createErrorResponse(
          "Full name must be at least 2 characters",
          400
        );
      }
      updateData.fullName = fullName;
      updateData.name = fullName; // for NextAuth
    }

    if (body.number !== undefined) {
      updateData.number = body.number.trim();
    }

    if (body.age !== undefined) {
      if (typeof body.age !== "number" || isNaN(body.age) || body.age < 0) {
        return createErrorResponse("Age must be a non-negative number", 400);
      }
      updateData.age = body.age;
    }

    if (body.gender !== undefined) {
      updateData.gender = body.gender.trim();
    }

    if (body.city !== undefined) {
      const city = body.city.trim();
      if (city.length < 2) {
        return createErrorResponse("City must be at least 2 characters", 400);
      }
      updateData.city = city;
    }

    if (body.state !== undefined) {
      const state = body.state.trim();
      if (state.length < 2) {
        return createErrorResponse("State must be at least 2 characters", 400);
      }
      updateData.state = state;
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { email: { $regex: new RegExp(`^${session.user.email}$`, "i") } },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (result === null || result.value === null) {
      return createErrorResponse("User not found", 404);
    }

    const user = result.value;

    const profileData: UserProfileResponse = {
      id: user._id.toString(),
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      number: user.number || "",
      age: (() => {
        if (typeof user.age === "number") return user.age;
        if (typeof user.age === "string") {
          const parsed = parseInt(user.age, 10);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      })(),
      gender: user.gender || "",
      city: user.city || "",
      state: user.state || "",
      image: user.image || session.user?.image || "",
      createdAt: user.createdAt || user._id.getTimestamp(),
      updatedAt: user.updatedAt || new Date(),
      emailVerified: Boolean(user.emailVerified),
      phoneVerified: Boolean(user.phoneVerified),
      isActive: user.isActive !== undefined ? Boolean(user.isActive) : true,
      lastLoginAt: user.lastLoginAt || new Date(),
    };

    return createSuccessResponse(profileData, "Profile updated successfully");
  } catch {
    // console.error(`[${requestId}] Unexpected error:`, error);(error: unknown)
    return createErrorResponse("Internal server error", 500);
  }
}

// -------------------- Unsupported Methods --------------------
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
    }
  );
}
