import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = getDb();

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
      .get(username, email);
    if (existing) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    db.prepare(
      "INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)"
    ).run(id, username, email, passwordHash);

    const token = await signToken({ userId: id, username });

    return NextResponse.json(
      { user: { id, username, email }, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
