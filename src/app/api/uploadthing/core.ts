import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(({ req }) => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachments: f(["image", "pdf", "video", "text", "audio"])
    .middleware((req) => handleAuth())
    .onUploadComplete(() => {}),
  courseVideo: f({ video: { maxFileSize: "4GB" } })
    .middleware((req) => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
