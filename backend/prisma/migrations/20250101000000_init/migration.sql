-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ORGANIZER', 'COUPLE', 'MC', 'GIFT_STAFF', 'GUEST');

-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CELEBRATION', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WeddingRole" AS ENUM ('OWNER', 'COUPLE', 'MC', 'GIFT_STAFF', 'MODERATOR');

-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('PHYSICAL_GIFT', 'MONETARY', 'OTHER', 'MESSAGE');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'VERIFIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REPORTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ORGANIZER',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weddings" (
    "id" TEXT NOT NULL,
    "event_token" TEXT NOT NULL,
    "couple_name" TEXT NOT NULL,
    "partner_name" TEXT NOT NULL,
    "wedding_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "cover_image" TEXT,
    "primary_language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Kigali',
    "status" "WeddingStatus" NOT NULL DEFAULT 'DRAFT',
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "role" "WeddingRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "token" TEXT NOT NULL,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "guest_id" TEXT,
    "guest_name" TEXT NOT NULL,
    "guest_phone" TEXT,
    "type" "ContributionType" NOT NULL,
    "description" TEXT,
    "monetary_amount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'RWF',
    "status" "ContributionStatus" NOT NULL DEFAULT 'PENDING',
    "is_acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_at" TIMESTAMP(3),
    "queue_position" INTEGER,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribution_queue" (
    "id" TEXT NOT NULL,
    "contribution_id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "is_acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contribution_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memories" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "guest_id" TEXT,
    "guest_name" TEXT,
    "media_type" "MediaType" NOT NULL,
    "storage_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "public_id" TEXT,
    "file_size" INTEGER NOT NULL,
    "duration" INTEGER,
    "mime_type" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "moderation_status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "caption" TEXT,
    "tags" TEXT[],
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_reports" (
    "id" TEXT NOT NULL,
    "memory_id" TEXT NOT NULL,
    "reporter_ip" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolved_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_themes" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primary" TEXT NOT NULL DEFAULT '#8B7355',
    "secondary" TEXT NOT NULL DEFAULT '#F5F0EB',
    "accent" TEXT NOT NULL DEFAULT '#C9A96E',
    "background" TEXT NOT NULL DEFAULT '#FDFBF7',
    "text" TEXT NOT NULL DEFAULT '#2C2C2C',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "wedding_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_analyses" (
    "id" TEXT NOT NULL,
    "memory_id" TEXT NOT NULL,
    "quality_score" INTEGER NOT NULL DEFAULT 0,
    "quality_grade" TEXT NOT NULL DEFAULT 'UNGRADED',
    "blur_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exposure_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brightness_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contrast_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sharpness_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "noise_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resolution_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "composition_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "perceptual_hash" TEXT,
    "color_histogram" JSONB,
    "dominant_colors" TEXT[],
    "ai_tags" TEXT[],
    "ai_category" TEXT,
    "ai_description" TEXT,
    "processing_status" TEXT NOT NULL DEFAULT 'PENDING',
    "processing_error" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memory_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duplicate_groups" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "group_size" INTEGER NOT NULL DEFAULT 0,
    "similarity_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommended_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duplicate_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duplicate_group_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "memory_id" TEXT NOT NULL,
    "similarity_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duplicate_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_highlights" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Wedding Highlights',
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "couple_moments" INTEGER NOT NULL DEFAULT 0,
    "family_moments" INTEGER NOT NULL DEFAULT 0,
    "ceremony_moments" INTEGER NOT NULL DEFAULT 0,
    "reception_moments" INTEGER NOT NULL DEFAULT 0,
    "friend_moments" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "last_generated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "highlight_items" (
    "id" TEXT NOT NULL,
    "highlights_id" TEXT NOT NULL,
    "memory_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "reason" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "highlight_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_albums" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Our Wedding Day',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_sections" (
    "id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "cover_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "album_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_section_items" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "memory_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "album_section_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_stories" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'A Day to Remember',
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_processing_logs" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total_items" INTEGER NOT NULL DEFAULT 0,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_processing_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_event_token_key" ON "weddings"("event_token");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_members_user_id_wedding_id_key" ON "wedding_members"("user_id", "wedding_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_token_key" ON "guests"("token");

-- CreateIndex
CREATE UNIQUE INDEX "contribution_queue_contribution_id_key" ON "contribution_queue"("contribution_id");

-- CreateIndex
CREATE UNIQUE INDEX "memory_analyses_memory_id_key" ON "memory_analyses"("memory_id");

-- CreateIndex
CREATE UNIQUE INDEX "duplicate_group_members_memory_id_key" ON "duplicate_group_members"("memory_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_highlights_wedding_id_key" ON "wedding_highlights"("wedding_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_albums_wedding_id_key" ON "wedding_albums"("wedding_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_stories_wedding_id_key" ON "wedding_stories"("wedding_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_members" ADD CONSTRAINT "wedding_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_members" ADD CONSTRAINT "wedding_members_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution_queue" ADD CONSTRAINT "contribution_queue_contribution_id_fkey" FOREIGN KEY ("contribution_id") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_reports" ADD CONSTRAINT "memory_reports_memory_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_themes" ADD CONSTRAINT "wedding_themes_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_analyses" ADD CONSTRAINT "memory_analyses_memory_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_groups" ADD CONSTRAINT "duplicate_groups_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_group_members" ADD CONSTRAINT "duplicate_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "duplicate_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_group_members" ADD CONSTRAINT "duplicate_group_members_memory_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_highlights" ADD CONSTRAINT "wedding_highlights_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlight_items" ADD CONSTRAINT "highlight_items_highlights_id_fkey" FOREIGN KEY ("highlights_id") REFERENCES "wedding_highlights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_albums" ADD CONSTRAINT "wedding_albums_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_sections" ADD CONSTRAINT "album_sections_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "wedding_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_section_items" ADD CONSTRAINT "album_section_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "album_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_stories" ADD CONSTRAINT "wedding_stories_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_processing_logs" ADD CONSTRAINT "ai_processing_logs_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
