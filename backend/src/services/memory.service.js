import prisma from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { cloudinary } from "../config/cloudinary.js";
import { emitToWall, emitToWedding } from "../config/socket.js";

class MemoryService {
  /**
   * Upload a memory file to Cloudinary and create the database record.
   */
  async upload(weddingId, file, data) {
    if (!file) {
      throw new Error("No file was uploaded");
    }

    let guestId = null;

    // Find guest from guest token
    if (data.guestToken) {
      const guest = await prisma.guest.findUnique({
        where: {
          token: data.guestToken,
        },
      });

      if (guest && guest.weddingId === weddingId) {
        guestId = guest.id;
      }
    }

    const mediaType = file.mimetype.startsWith("video/")
      ? "VIDEO"
      : "PHOTO";

    /**
     * Upload the file buffer directly to Cloudinary.
     *
     * multer.memoryStorage() gives us:
     * file.buffer
     *
     * We convert that buffer into a Cloudinary upload stream.
     */
    const uploadResult = await this.uploadToCloudinary(file);

    const storageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    /**
     * Cloudinary can generate transformed thumbnail URLs.
     *
     * For images we use the uploaded image itself.
     * For videos we generate a JPG thumbnail from the first frame.
     */
    const thumbnailUrl =
      mediaType === "PHOTO"
        ? this.generateImageThumbnail(publicId)
        : this.generateVideoThumbnail(publicId);

    // Save the uploaded memory in PostgreSQL
    const memory = await prisma.memory.create({
      data: {
        weddingId,
        guestId,
        guestName: data.guestName || null,

        mediaType,

        storageUrl,
        thumbnailUrl,

        publicId,

        fileSize: file.size,
        mimeType: file.mimetype,

        caption: data.caption || null,

        moderationStatus: "PENDING",
      },
    });

    // Notify connected wedding clients
    emitToWedding(weddingId, "memory:uploaded", {
      id: memory.id,
      mediaType,
      guestName: data.guestName,
      timestamp: memory.createdAt,
    });

    return memory;
  }

  /**
   * Upload a Multer memory buffer to Cloudinary.
   */
  uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
      const resourceType = file.mimetype.startsWith("video/")
        ? "video"
        : "image";

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "wedora/memories",
          resource_type: resourceType,
          public_id: `${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Generate a thumbnail URL for an image.
   */
  generateImageThumbnail(publicId) {
    return cloudinary.url(publicId, {
      resource_type: "image",
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
      secure: true,
    });
  }

  /**
   * Generate a thumbnail from the first frame of a video.
   */
  generateVideoThumbnail(publicId) {
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "fill",
          quality: "auto",
        },
      ],
      secure: true,
    });
  }

  async list(weddingId, filters) {
    const {
      page = 1,
      limit = 20,
      mediaType,
      moderationStatus,
      sort,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
      weddingId,
    };

    if (mediaType) {
      where.mediaType = mediaType;
    }

    if (moderationStatus) {
      where.moderationStatus = moderationStatus;
    } else {
      where.moderationStatus = {
        not: "REMOVED",
      };
    }

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),

      prisma.memory.count({
        where,
      }),
    ]);

    return {
      memories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approve(id) {
    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    });

    if (!memory) {
      throw new NotFoundError("Memory");
    }

    const updated = await prisma.memory.update({
      where: {
        id,
      },

      data: {
        moderationStatus: "APPROVED",
      },
    });

    emitToWall(memory.weddingId, "memory:approved", {
      id: updated.id,
      storageUrl: updated.storageUrl,
      thumbnailUrl: updated.thumbnailUrl,
      mediaType: updated.mediaType,
      guestName: updated.guestName,
      caption: updated.caption,
    });

    return updated;
  }

  async reject(id) {
    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    });

    if (!memory) {
      throw new NotFoundError("Memory");
    }

    return prisma.memory.update({
      where: {
        id,
      },

      data: {
        moderationStatus: "REJECTED",
      },
    });
  }

  async remove(id) {
    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    });

    if (!memory) {
      throw new NotFoundError("Memory");
    }

    /**
     * Delete the actual file from Cloudinary.
     */
    if (memory.publicId) {
      try {
        const resourceType =
          memory.mediaType === "VIDEO"
            ? "video"
            : "image";

        await cloudinary.uploader.destroy(memory.publicId, {
          resource_type: resourceType,
        });
      } catch (error) {
        console.error(
          "[Cloudinary] Failed to delete memory:",
          error.message
        );
      }
    }

    return prisma.memory.update({
      where: {
        id,
      },

      data: {
        moderationStatus: "REMOVED",
      },
    });
  }

  async report(id, reason, reporterIp) {
    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    });

    if (!memory) {
      throw new NotFoundError("Memory");
    }

    await prisma.memoryReport.create({
      data: {
        memoryId: id,
        reason,
        reporterIp,
      },
    });

    return prisma.memory.update({
      where: {
        id,
      },

      data: {
        moderationStatus: "REPORTED",
      },
    });
  }

  async getTimeline(weddingId) {
    const memories = await prisma.memory.findMany({
      where: {
        weddingId,
        moderationStatus: "APPROVED",
      },

      orderBy: {
        createdAt: "asc",
      },

      select: {
        id: true,
        createdAt: true,
        mediaType: true,
        storageUrl: true,
        thumbnailUrl: true,
        guestName: true,
      },
    });

    const groups = {};

    memories.forEach((memory) => {
      const hour = new Date(memory.createdAt).getHours();

      const period =
        hour < 10
          ? "MORNING"
          : hour < 14
          ? "CEREMONY"
          : hour < 17
          ? "RECEPTION"
          : hour < 20
          ? "CELEBRATION"
          : "FINAL_MOMENTS";

      if (!groups[period]) {
        groups[period] = [];
      }

      groups[period].push(memory);
    });

    return Object.entries(groups).map(([period, items]) => ({
      period,
      count: items.length,
      memories: items,
    }));
  }

  async getApprovedForWall(weddingId) {
    return prisma.memory.findMany({
      where: {
        weddingId,
        moderationStatus: "APPROVED",
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 50,

      select: {
        id: true,
        storageUrl: true,
        thumbnailUrl: true,
        mediaType: true,
        guestName: true,
        caption: true,
        createdAt: true,
      },
    });
  }

  async toggleFavorite(id) {
    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    });

    if (!memory) {
      throw new NotFoundError("Memory");
    }

    return prisma.memory.update({
      where: {
        id,
      },

      data: {
        isFavorite: !memory.isFavorite,
      },
    });
  }
}

export const memoryService = new MemoryService();