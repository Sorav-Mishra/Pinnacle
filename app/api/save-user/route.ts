import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/clientPromise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, number, age, gender, city, state } = body;

    // 🛡️ Input validation
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !number?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !gender?.trim() ||
      !Number.isInteger(age) ||
      age < 13 ||
      age > 120
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required and must be valid." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });

    const userData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      number: number.trim(),
      age,
      gender: gender.trim(),
      city: city.trim(),
      state: state.trim(),
      formSubmitted: true,
      formSubmittedAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingUser) {
      await db.collection("users").updateOne(
        { email },
        {
          $set: userData,
        }
      );
    } else {
      await db.collection("users").insertOne({
        ...userData,
        createdAt: new Date(),
        isActive: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User saved successfully",
    });
  } catch {
    //  console.error("❌ Failed to save user:", error); (error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
