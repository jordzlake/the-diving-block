import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(200, "Title must be no more than 200 characters."),
  specialText: z
    .string()
    .min(2, "Special Text must be at least 2 characters.")
    .max(30, "Special Text must be no more than 30 characters.")
    .optional(),
  cost: z
    .number()
    .min(0, "Cost cannot be less than 0.")
    .max(99999, "Cost cannot be more than 99999."),
  quantity: z
    .number()
    .min(0, "Amount cannot be less than 0.")
    .max(99999, "Amount cannot be more than 99999."),
  description: z
    .string()
    .min(0, "Description cannot be less than 0 characters.")
    .max(9999999, "Description cannot be more than 9999999 characters."),
});

export const settingsSchema = z.object({
  categories: z.array(
    z.object({
      name: z
        .string()
        .min(2, "Category name must be at least 2 characters.")
        .max(100, "Category name must be no more than 30 characters."),
      subCategories: z.array(z.string()),
    })
  ),
  sizes: z
    .array(z.string().max(30, "Size must be no more than 30 characters."))
    .optional(),
  locations: z.array(
    z.object({
      name: z.string().min(2, "Location name must be at least 2 characters."),
      cost: z
        .number()
        .min(0, "Location cost cannot be less than 0.")
        .max(99999, "Location cost cannot be more than 99999."),
    })
  ),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(100, "Category name must be no more than 30 characters."),
  subCategories: z.array(z.string()),
});

export const locationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters."),
  cost: z
    .number()
    .min(0, "Location cannot be less than 0.")
    .max(99999, "Location cannot be more than 99999."),
});

export const userSchema = z.object({
  email: z
    .string()
    .min(3, "Email must be at least 3 characters.")
    .max(50, "Email must be no more than 50 characters.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.") // Assuming a minimum
    .max(100, "Password must be no more than 100 characters."), // Reasonable limit
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name must be no more than 50 characters.")
    .regex(
      /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      "First name cannot contain special symbols."
    ),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name must be no more than 50 characters.")
    .regex(
      /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      "Last name cannot contain special symbols."
    ),
  city: z
    .string()
    .min(1, "City is required.")
    .max(100, "City must be no more than 100 characters."),
  street: z
    .string()
    .min(1, "Street is required.")
    .max(200, "Street must be no more than 200 characters."),
  phone: z
    .string()
    .min(1, "Phone is required.")
    .max(200, "Phone must be no more than 200 characters."),
  isAdmin: z.boolean().default(false),
});
