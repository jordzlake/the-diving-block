import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { User } from "@/lib/models";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import { redirect } from "next/navigation";

const login = async (credentials) => {
  try {
    connectToDb();
  } catch (error) {
    throw new Error("Failed to Log in");
  }

  const user = await User.findOne({ email: credentials.email });
  if (!user) {
    throw new Error("Invalid Credentials");
    //return { errors: { general: "Invalid Credentials" } };
  }

  const isPasswordCorrect = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid Credentials");
    //return { errors: { general: "Invalid Credentials" } };
  }

  let data = user.toObject();
  delete data.password;
  return data;
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await login(credentials);

          if (user) {
            return user;
          }
          return null;
        } catch (err) {
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
});
