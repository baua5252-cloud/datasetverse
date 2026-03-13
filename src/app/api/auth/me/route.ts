import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";

interface UserRow {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, username, email, created_at FROM users WHERE id = ?")
      .get(payload.userId) as UserRow | undefined;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth/me error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
