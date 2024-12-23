CREATE TABLE IF NOT EXISTS "Attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"url" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Chapter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"video_url" varchar(255),
	"position" integer NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"course_id" uuid NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Course" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"image_url" varchar,
	"price" numeric(12, 2),
	"is_published" boolean DEFAULT false NOT NULL,
	"category_id" uuid,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MuxData" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar(255) NOT NULL,
	"playback_id" varchar(255),
	"chapter_id" uuid NOT NULL,
	CONSTRAINT "MuxData_chapter_id_unique" UNIQUE("chapter_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Purchase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"course_id" uuid NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "user_id_course_id_unique" UNIQUE("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StripeCustomer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255) NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "StripeCustomer_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "StripeCustomer_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"chapter_id" uuid NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "UserProgress_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "UserProgress_chapter_id_unique" UNIQUE("chapter_id"),
	CONSTRAINT "user_id_chapter_id_unique" UNIQUE("user_id","chapter_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_course_id_Course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_course_id_Course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Course" ADD CONSTRAINT "Course_category_id_Category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MuxData" ADD CONSTRAINT "MuxData_chapter_id_Chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."Chapter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_course_id_Course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_chapter_id_Chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."Chapter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "attachment_table_idx" ON "Attachment" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "attachment_table_course_idx" ON "Attachment" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_table_idx" ON "Category" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_table_course_idx" ON "Chapter" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_table_idx" ON "Course" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "puchase_table_course_idx" ON "Purchase" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_progress_table_chapter_idx" ON "UserProgress" USING btree ("chapter_id");