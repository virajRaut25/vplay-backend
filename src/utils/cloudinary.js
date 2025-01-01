import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary ", res);
    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    // remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async (publicId) => {
  try {
    const res = await cloudinary.api.delete_resources([publicId]);
    console.log("File is deleted on cloudinary", res);
    return res;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
