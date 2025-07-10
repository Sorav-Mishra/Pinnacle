// app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // Get the JWT token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phone, age, gender, dob } = body;

    // Validate required fields
    if (!phone || !age || !gender || !dob) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate age is a number
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      return NextResponse.json(
        { error: "Invalid age provided" },
        { status: 400 }
      );
    }

    // Validate gender
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid gender provided" },
        { status: 400 }
      );
    }

    // Validate date of birth
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth provided" },
        { status: 400 }
      );
    }

    // Update user profile in database
    const client = await clientPromise;
    const db = client.db("test");

    const updateResult = await db.collection("users").updateOne(
      { email: token.email },
      {
        $set: {
          phone: phone.trim(),
          age: ageNumber,
          gender: gender.toLowerCase(),
          dob: dob,
          profileCompletedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Profile not updated" },
        { status: 500 }
      );
    }

    // console.log("✅ Profile updated successfully for:", token.email);

    return NextResponse.json({
      message: "Profile updated successfully",
      data: {
        phone: phone.trim(),
        age: ageNumber,
        gender: gender.toLowerCase(),
        dob: dob,
      },
    });
  } catch {
    // console.error("❌ Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
