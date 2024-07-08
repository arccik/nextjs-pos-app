import { eq } from "drizzle-orm";
import { db } from "../db";
import { VenueSettings, venueSettings } from "../../schemas";

export const getSettings = async () => {
  try {
    return await db.query.venueSettings.findFirst();
  } catch (error) {
    console.log(error);
    return { error: "[db:getVenueSettings] Went wrong.." };
  }
};
export const updateSettings = async (data: VenueSettings) => {
  try {
    return await db
      .update(venueSettings)
      .set({ ...data, updatedAt: new Date().toDateString() })
      .where(eq(venueSettings.id, data.id))
      .returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:updateVenueSettings] Went wrong.." };
  }
};
export const createSettings = async (data: any) => {
  try {
    return await db.insert(venueSettings).values(data).returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:createVenueSettings] Went wrong.." };
  }
};
