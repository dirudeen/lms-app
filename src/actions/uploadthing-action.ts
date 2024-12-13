"use server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteUTFile = async (url: string) => {
    const key = url.split("/").pop();
    if(!key) return;
  try {
    await utapi.deleteFiles(key);
  } catch (error) {
    console.error("UTAPI: Error deleting files", error);
  }
};