import { NextRequest, NextResponse } from "next/server";
import User from "../../models/user";
import { connectDB } from "../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      fullName,
      email,
      number,
      age,
      gender,
      city,
      state,
      ipAddress,
      userAgent,
    }: {
      fullName: string;
      email: string;
      number: string;
      age: number;
      gender: "male" | "female" | "other" | "prefer-not-to-say";
      city: string;
      state: string;
      ipAddress?: string;
      userAgent?: string;
    } = body;

    const newUser = new User({
      fullName,
      email,
      number,
      age,
      gender,
      city,
      state,
      ipAddress,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User saved successfully" },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
