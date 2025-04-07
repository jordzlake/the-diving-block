import { Settings } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { settings } from "@/lib/default/settings";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    connectToDb();
    await Settings.deleteMany({});
    let tempSettings = settings;
    const importSettings = await Settings.insertMany(tempSettings);
    return NextResponse.json({ importSettings });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: `Something went wrong: ${err}` });
  }
}
