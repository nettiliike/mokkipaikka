"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Inquiry = {
  id: string;
  cottageId: string;
  cottageName: string;
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  message: string;
  createdAt?: unknown;
};

export async function saveOwnerContact(ownerId: string, email: string) {
  if (!ownerId || !email) return;
  await setDoc(
    doc(db, "ownerContacts", ownerId),
    { email, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function createInquiry(data: Omit<Inquiry, "id" | "createdAt">) {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== "")
  );
  await addDoc(collection(db, "inquiries"), {
    ...cleanData,
    createdAt: serverTimestamp(),
  });
}

export async function getOwnerInquiries(ownerId: string): Promise<Inquiry[]> {
  const q = query(
    collection(db, "inquiries"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Inquiry, "id">),
  }));
}
