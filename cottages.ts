"use client";

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Cottage } from "./types";

function normalize(id: string, data: Record<string, any>): Cottage {
  const images = Array.isArray(data.images)
    ? data.images
    : data.image
    ? [data.image]
    : [];

  return {
    id,
    name: data.name || "Nimetön mökki",
    city: data.city || "",
    area: data.area || "",
    price: Number(data.price || 0),
    guests: Number(data.guests || 1),
    description: data.description || "",
    owner: data.owner || "",
    ownerId: data.ownerId || "",
    phone: data.phone || "",
    image: images[0] || "/hero.jpg",
    images,
    amenities: data.amenities || {},
    blockedRanges: data.blockedRanges || [],
    published: data.published !== false,
    latitude:
      data.latitude !== undefined ? Number(data.latitude) : undefined,
    longitude:
      data.longitude !== undefined ? Number(data.longitude) : undefined,
    createdAt: data.createdAt ?? null,
  };
}

export async function getPublishedCottages() {
  const q = query(
    collection(db, "cottages"),
    where("published", "==", true)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => normalize(d.id, d.data()));
}

export async function getCottage(id: string) {
  const snap = await getDoc(doc(db, "cottages", id));

  if (!snap.exists()) return null;

  return normalize(snap.id, snap.data());
}

export async function getOwnerCottages(ownerId: string) {
  const q = query(
    collection(db, "cottages"),
    where("ownerId", "==", ownerId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => normalize(d.id, d.data()));
}

export async function saveCottage(
  cottage: Partial<Cottage> & { id: string }
) {
  const { id, ...data } = cottage;

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined
    )
  );

  await setDoc(
    doc(db, "cottages", id),
    {
      ...cleanData,

      // Mökki on oletuksena julkaistu
      published: cleanData.published !== false,

      // Vanha sähköposti poistetaan dokumentista
      email: deleteField(),
    },
    {
      merge: true,
    }
  );
}

export async function removeCottage(id: string) {
  await deleteDoc(doc(db, "cottages", id));
}