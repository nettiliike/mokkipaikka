"use client";

const MAX_IMAGES = 3;
const MAX_SOURCE_SIZE = 12 * 1024 * 1024;
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 960;
const JPEG_QUALITY = 0.68;
const MAX_TOTAL_DATA_URL_LENGTH = 760_000;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`${file.name}: kuvan lukeminen epäonnistui.`));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Kuvan käsittely epäonnistui. Kokeile JPG-, PNG- tai WebP-kuvaa."));
    image.src = src;
  });
}

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} ei ole kuvatiedosto.`);
  }
  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error(`${file.name} on yli 12 Mt.`);
  }

  const source = await readAsDataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(1, MAX_WIDTH / image.width, MAX_HEIGHT / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Kuvan pakkaaminen epäonnistui.");
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Pakkaa kuvat selaimessa ja palauttaa ne data-URL-muodossa.
 * Kuvat tallennetaan mökin Firestore-dokumenttiin, joten määrä ja koko pidetään pieninä.
 */
export async function uploadCottageImages(
  _ownerId: string,
  _cottageId: string,
  files: File[]
): Promise<string[]> {
  if (files.length > MAX_IMAGES) {
    throw new Error(`Voit lisätä kerralla enintään ${MAX_IMAGES} kuvaa.`);
  }

  const images: string[] = [];
  for (const file of files) images.push(await compressImage(file));

  const totalLength = images.reduce((sum, image) => sum + image.length, 0);
  if (totalLength > MAX_TOTAL_DATA_URL_LENGTH) {
    throw new Error("Kuvien yhteiskoko on liian suuri. Valitse vähemmän kuvia tai pienemmät kuvat.");
  }
  return images;
}
