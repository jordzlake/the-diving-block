import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(30, "Title must be no more than 30 characters.")
    .regex(
      /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      "Title cannot contain special symbols."
    ),
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
        .max(30, "Category name must be no more than 30 characters.")
        .regex(
          /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
          "Category name cannot contain special symbols."
        ),
      subCategories: z.array(z.string()),
    })
  ),
  sizes: z
    .array(
      z
        .string()
        .min(2, "Size must be at least 2 characters.")
        .max(30, "Size must be no more than 30 characters.")
        .regex(
          /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
          "Size cannot contain special symbols."
        )
    )
    .optional(),
  locations: z
    .array(
      z.object({
        type: z
          .string()
          .min(2, "Location type must be at least 2 characters.")
          .max(30, "Location type must be no more than 30 characters.")
          .regex(
            /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
            "Location type cannot contain special symbols."
          ),
      })
    )
    .optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(30, "Category name must be no more than 30 characters.")
    .regex(
      /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      "Category name cannot contain special symbols."
    ),
  subCategories: z.array(z.string()),
});

export const locationSchema = z.object({
  type: z
    .string()
    .min(2, "Location type must be at least 2 characters.")
    .max(30, "Location type must be no more than 30 characters.")
    .regex(
      /^[^`~!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      "Location type cannot contain special symbols."
    ),
});
