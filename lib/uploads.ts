"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadCottageImages(
  ownerId: string,
  cottageId: string,
  files: File[]
): Promise<string[]> {
  const uploaded: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`${file.name} on yli 10 Mt.`);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `cottages/${ownerId}/${cottageId}/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType: file.type });
    uploaded.push(await getDownloadURL(storageRef));
  }

  return uploaded;
}
