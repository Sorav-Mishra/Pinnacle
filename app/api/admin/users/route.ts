import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🛡️ Restrict access to admin
  if (!session || session.user.email !== "soravmishra753@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("test"); // change this
  const users = await db.collection("users").find({}).toArray();

  return NextResponse.json(users);
}
