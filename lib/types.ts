export const INTERESTS = [
  "Technology",
  "Entrepreneurship",
  "Design",
  "Coffee",
  "Arts & Culture",
  "Music",
  "Outdoors",
  "Workshops",
] as const;

export const VIBES = ["Relaxed", "Social", "Professional", "Hands-on"] as const;

export type Category = (typeof INTERESTS)[number];
export type Vibe = (typeof VIBES)[number];

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  imageCreditUrl: string;
  startAt: string;
  endAt: string;
  venue: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: "TWD";
  category: Category;
  vibes: Vibe[];
  organizer: string;
  registrationUrl: string | null;
};

export type Preferences = {
  name: string;
  interests: Category[];
  city: string;
  maxDistance: number;
  vibes: Vibe[];
  maxPrice: number;
  freeOnly: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  name: "",
  interests: ["Design", "Coffee", "Outdoors"],
  city: "Taipei",
  maxDistance: 10,
  vibes: ["Relaxed", "Social"],
  maxPrice: 1000,
  freeOnly: false,
};

export type Decision = {
  eventId: string;
  action: "saved" | "skipped";
  wasSaved: boolean;
};
