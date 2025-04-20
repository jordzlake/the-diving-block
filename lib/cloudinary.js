"use server";

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryItems = async (publicIds) => {
  try {
    console.log(cloudinary.config());
    let result = await cloudinary.v2.api.delete_resources(publicIds);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};
