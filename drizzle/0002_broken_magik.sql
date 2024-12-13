ALTER TABLE "Attachment" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Attachment" ADD COLUMN "name" text NOT NULL;