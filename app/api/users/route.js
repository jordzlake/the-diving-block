import { User } from "@/lib/models";

import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { userSchema } from "@/lib/schema";
import bcrypt from "bcryptjs";

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

export const POST = async (req, res) => {
  const { user } = await req.json();
  try {
    await connectToDb();

    const validationResult = userSchema.safeParse(user);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) =>
          `${issue.path}: 
               ${issue.message}`
      );
      return NextResponse.json({ errors });
    }
    let found = await User.findOne({ email: user.email });
    if (found) {
      return { errors: ["Email already exists"] };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      phone: user.phone,
      street: user.street,
      isAdmin: user.isAdmin ? true : false,
    });
    await newUser.save();

    console.log("user", newUser);
    return NextResponse.json({ success: newUser });
  } catch (err) {
    return NextResponse.json({ errors: [err.message] });
  }
};
