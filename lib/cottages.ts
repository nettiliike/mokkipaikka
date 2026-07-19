"use client";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Cottage } from "./types";

function normalize(id: string, data: Record<string, any>): Cottage {
  const images = Array.isArray(data.images) ? data.images : data.image ? [data.image] : [];
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
    email: data.email || "",
    phone: data.phone || "",
    image: images[0] || "/hero.jpg",
    images,
    amenities: data.amenities || {},
    blockedRanges: data.blockedRanges || data.bookings || [],
    published: data.published !== false,
    latitude: Number(data.latitude) || undefined,
    longitude: Number(data.longitude) || undefined,
    createdAt: data.createdAt,
  };
}

export async function getPublishedCottages() {
  const snap = await getDocs(collection(db, "cottages"));
  return snap.docs.map(d => normalize(d.id, d.data())).filter(c => c.published !== false);
}
export async function getCottage(id: string) {
  const snap = await getDoc(doc(db, "cottages", id));
  return snap.exists() ? normalize(snap.id, snap.data()) : null;
}
export async function getOwnerCottages(ownerId: string) {
  const snap = await getDocs(query(collection(db, "cottages"), where("ownerId", "==", ownerId)));
  return snap.docs.map(d => normalize(d.id, d.data()));
}
export async function saveCottage(cottage: Partial<Cottage> & { id: string }) {
  const { id, ...data } = cottage;
  await setDoc(doc(db, "cottages", id), data, { merge: true });
}
export async function removeCottage(id: string) { await deleteDoc(doc(db, "cottages", id)); }
