import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: (_req, file) => ({
    folder: "wedora/memories",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "mp4", "mov", "webm"],
    public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
  }),
});

export const uploadMemory = multer({
  storage: photoStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp", "image/heic",
      "video/mp4", "video/quicktime", "video/webm",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

export { cloudinary };
export default configureCloudinary;
