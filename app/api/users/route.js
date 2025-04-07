import { User } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    connectToDb();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
