import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  type VenueSettings,
  type NewVenueSettings,
  venueSettings,
} from "../db/schemas";

export const getSettings = async () => {
  return await db.query.venueSettings.findFirst();
};
export const updateSettings = async (data: VenueSettings) => {
  return await db
    .update(venueSettings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(venueSettings.id, data.id))
    .returning();
};
export const createSettings = async (data: NewVenueSettings) => {
  return await db.insert(venueSettings).values(data).returning();
};
