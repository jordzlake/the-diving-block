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
    colorImageVariants: [
      {
        color: String,
        image: String,
      },
    ],
    sizeCostVariants: [
      {
        size: String,
        cost: String,
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
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String },
      city: { type: String },
      phone: { type: String, required: true },
    },
    orderItems: [
      {
        item: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        color: {
          type: String,
        },
        size: {
          type: String,
        },
        amount: {
          type: Number,
        },
        orderItemTotal: {
          type: Number,
          required: true,
        },
        meta: [{ title: String, value: String }],
      },
    ],
    paymentStatus: {
      type: String,
      default: "Pending",
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
        name: String,
        cost: Number,
      },
    ],
    sales: [
      {
        name: String,
        discount: Number,
        items: [{ type: mongoose.Schema.Types.Mixed }],
        description: String,
        enabled: { type: Boolean, default: true },
      },
    ],
    sitesale: {
      name: String,
      discount: Number,
      description: String,
      enabled: { type: Boolean, default: true },
    },
    categorysales: [
      {
        name: String,
        category: { type: mongoose.Schema.Types.Mixed },
        subCategories: { type: mongoose.Schema.Types.Mixed },
        discount: Number,
        description: String,
        enabled: { type: Boolean, default: true },
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
