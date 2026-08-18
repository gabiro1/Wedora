import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryUpload() {
  try {
    console.log("Uploading test image...");

    const result = await cloudinary.uploader.upload("./test-image.jpg", {
      folder: "wedora/test",
    });

    console.log("✅ Image uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Image URL:", result.secure_url);
  } catch (error) {
    console.error("❌ Image upload failed!");
    console.error("Message:", error.message);
    console.error("HTTP code:", error.http_code);
    console.error("Full error:", error);
  }
}

testCloudinaryUpload();