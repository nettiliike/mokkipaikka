export type AmenityKey = "sauna" | "beach" | "hotTub" | "boat" | "pets" | "electricity" | "drinkingWater" | "indoorToilet";

export type Cottage = {
  id: string;
  name: string;
  city: string;
  area?: string;
  price: number;
  guests: number;
  description: string;
  owner?: string;
  ownerId?: string;
  phone?: string;
  image?: string;
  images?: string[];
  amenities?: Partial<Record<AmenityKey, boolean>>;
  blockedRanges?: { start: string; end: string }[];
  published?: boolean;
  latitude?: number;
  longitude?: number;
  createdAt?: unknown;
};
