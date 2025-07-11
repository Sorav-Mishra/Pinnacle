import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  console.log("✅ API Route Hit: /api/user/update-profile");

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phone, age, gender, dob } = body;

    if (!phone || !age || !gender || !dob) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const ageNumber = typeof age === "number" ? age : parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      return NextResponse.json(
        { error: "Invalid age provided" },
        { status: 400 }
      );
    }

    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid gender provided" },
        { status: 400 }
      );
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");

    const updateResult = await db.collection("users").updateOne(
      { email: token.email },
      {
        $set: {
          email: token.email,
          phone: phone.trim(),
          age: ageNumber,
          gender: gender.toLowerCase(),
          dob: dob,
          profileCompletedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("✅ Mongo Update Result:", updateResult);

    return NextResponse.json({
      message: "Profile updated successfully",
      data: {
        phone: phone.trim(),
        age: ageNumber,
        gender: gender.toLowerCase(),
        dob: dob,
      },
    });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
