import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../lib/mongodb";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { timeSpent } = await req.json();
  const client = await clientPromise;
  const db = client.db("test");

  await db.collection("users").updateOne(
    { email: session.user.email },
    {
      $inc: { totalTimeSpent: timeSpent },
      $set: { lastLoginAt: new Date() },
    }
  );

  return NextResponse.json({ success: true });
}
