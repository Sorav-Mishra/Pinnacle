import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/clientPromise";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { z, ZodError } from "zod";
import { Document, WithId } from "mongodb";

// -------------------- Schema --------------------
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
interface UpdateData {
  fullName?: string;
  city?: string;
  state?: string;
  updatedAt: Date;
}

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  number: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date;
}

// -------------------- Helpers --------------------
function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function createErrorResponse(
  message: string,
  statusCode = 400,
  errors?: string[]
): NextResponse {
  return NextResponse.json(
    { success: false, message, errors },
    { status: statusCode }
  );
}

function createSuccessResponse<T>(data: T, message = "Success"): NextResponse {
  return NextResponse.json({ success: true, message, data });
}

// -------------------- Handler --------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] POST /api/user/update-profile`);

  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return createErrorResponse("Unauthorized", 401);
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return createErrorResponse("Invalid JSON format", 400);
    }

    if (typeof rawBody !== "object" || rawBody === null) {
      return createErrorResponse("Invalid request body", 400);
    }

    const sanitizedBody = { ...rawBody } as Record<string, string>;
    ["fullName", "city", "state"].forEach((field) => {
      if (typeof sanitizedBody[field] === "string") {
        sanitizedBody[field] = sanitizeInput(sanitizedBody[field]);
      }
    });

    let validatedData;
    try {
      validatedData = UpdateProfileSchema.parse(sanitizedBody);
    } catch (err) {
      const error = err as ZodError;
      return createErrorResponse(
        "Validation failed",
        400,
        error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
      );
    }

    if (validatedData.email !== userEmail) {
      return createErrorResponse("Access denied", 403);
    }

    const client = await clientPromise;
    const db = client.db();

    const updateData: UpdateData = {
      updatedAt: new Date(),
    };

    if (validatedData.fullName) updateData.fullName = validatedData.fullName;
    if (validatedData.city) updateData.city = validatedData.city;
    if (validatedData.state) updateData.state = validatedData.state;

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { email: userEmail.toLowerCase() },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result || !result.value) {
      return createErrorResponse("User not found", 404);
    }

    const updatedUser = result.value as WithId<Document>;

    const profileData: ProfileData = {
      id: updatedUser._id.toString(),
      fullName:
        (updatedUser.fullName as string) || (updatedUser.name as string) || "",
      email: (updatedUser.email as string) || "",
      number: (updatedUser.number as string) || "",
      age: (updatedUser.age as number) || 0,
      gender: (updatedUser.gender as string) || "",
      city: (updatedUser.city as string) || "",
      state: (updatedUser.state as string) || "",
      image: (updatedUser.image as string) || session.user.image || "",
      createdAt:
        (updatedUser.createdAt as Date) ||
        (updatedUser._id && typeof updatedUser._id.getTimestamp === "function"
          ? updatedUser._id.getTimestamp()
          : new Date()),
      updatedAt: (updatedUser.updatedAt as Date) || new Date(),
      emailVerified: (updatedUser.emailVerified as boolean) || false,
      phoneVerified: (updatedUser.phoneVerified as boolean) || false,
      isActive:
        updatedUser.isActive !== undefined
          ? (updatedUser.isActive as boolean)
          : true,
      lastLoginAt: (updatedUser.lastLoginAt as Date) || new Date(),
    };

    return createSuccessResponse<ProfileData>(
      profileData,
      "Profile updated successfully"
    );
  } catch (err) {
    console.error(`[${crypto.randomUUID()}] Internal server error:`, err);
    return createErrorResponse("Internal server error", 500);
  }
}
