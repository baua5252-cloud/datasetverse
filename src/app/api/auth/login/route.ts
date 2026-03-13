import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, username, email, password_hash FROM users WHERE email = ?")
      .get(email) as UserRow | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({ userId: user.id, username: user.username });

    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
