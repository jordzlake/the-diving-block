import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    city: {
      type: String,
      required: true,
      maxlength: 100,
    },
    street: {
      type: String,
      required: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 200,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    spec: {
      type: String,
      required: false,
      maxlength: 20,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    subCategory: String,
    cost: {
      type: Number,
      required: false,
    },

    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "New Item!",
    },
    galleryImages: {
      type: [String],
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    dimensions: String,
    colors: [
      {
        name: String,
        hexcode: String,
      },
    ],
    sizes: [String],
    brand: {
      type: String,
      required: false,
    },
    notes: String,

    tags: String,
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    new: {
      type: Boolean,
      required: false,
      default: true,
    },
    status: {
      type: String,
      required: true,
      default: "In Progress",
    },
    total: {
      type: Number,
      required: true,
      default: "0",
    },
    customerData: {
      email: { type: String, required: true },
      recipient: { type: String, required: true },
      address: { type: String },
      phone: { type: String, required: true },
    },
    orderItems: [
      {
        item: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        amount: {
          type: Number,
        },
        orderItemtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
    },
    instructions: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    pickupLocation: {
      type: String,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

const settingsSchema = new mongoose.Schema(
  {
    categories: [
      {
        name: String,
        subCategories: [String],
      },
    ],
    sizes: [String],
    locations: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
export const Order =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
export const Settings =
  mongoose.models?.Settings || mongoose.model("Settings", settingsSchema);
