import { User } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    connectToDb();
    const user = await User.findById(id);
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const POST = async (req, res) => {
  const { user } = await req.json();

  try {
    connectToDb();
    let userFound = await User.findOne({ email: user.email });
    if (userFound) {
      return { errors: { general: "Email already exists" } };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      street: user.street,
      phone: user.phone,
    });
    console.log("user", newUser);
    await newUser.save();
    //return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.json({ success: newUser });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const PUT = async (req, res) => {
  const { user } = await req.json();

  try {
    console.log("Updating user with data:", user);
    let userFound = await User.findOne({ email: user.email });
    console.log("user found", userFound ? userFound.email : "no user found");
    connectToDb();
    if (userFound) {
      const salt = await bcrypt.genSalt(10);
      console.log("user password before hashing", user.password);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      console.log("hashed password", hashedPassword);
      const updatedUser = await User.findByIdAndUpdate(user.id, {
        email: user.email,
        password: user.password ? hashedPassword : userFound.password,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        street: user.street,
        phone: user.phone,
      });

      console.log("user", updated);
      await updatedUser.save();
      //return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.json({ success: updatedUser });
    } else {
      return NextResponse.json({
        error: `no user found with email ${user.email}`,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
