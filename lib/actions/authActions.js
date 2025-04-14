"use server";

import { signIn, signOut } from "@/lib/auth";

import { AuthError } from "next-auth";

export async function handleCredentialsSignIn({ email, password }) {
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: ["Invalid Credentials"],
      };
    }
    throw error;
  }
}
