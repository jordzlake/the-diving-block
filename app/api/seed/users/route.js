import { User } from "@/lib/models";
import { users } from "@/lib/default/users";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    connectToDb();
    await User.deleteMany({});
    let tempUsers = users;
    const salt = await bcrypt.genSalt(10);
    let newUsers = await Promise.all(
      tempUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);

        return {
          email: user.email,
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          phone: user.phone,
          street: user.street,
        };
      })
    );
    const importUsers = await User.insertMany(newUsers);
    return NextResponse.json({ importUsers });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: `Something went wrong: ${err}` });
  }
}
