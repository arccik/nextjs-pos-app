import { create } from "zustand";
import type {
  StoreRegularSchedule,
  StoreSettings,
  Table,
} from "@server/src/schemas";

const API_URL = import.meta.env.VITE_API_URL;

type RestaurantVenue = {
  venueTables: Table[] | null;
  venueSettings: StoreSettings | null;
  venueRegularSchedule: StoreRegularSchedule[] | null;
  setVenueSettings: () => void;
  setVenueRegularSchedule: () => void;
  setVenueTables: () => void;
};

export const useVenueSettings = create<RestaurantVenue>((set) => ({
  venueSettings: null,
  venueRegularSchedule: null,
  venueTables: null,
  setVenueTables: async () => {
    const res = await fetch(`${API_URL}/table`);
    const data = await res.json();
    set({ venueTables: data });
  },

  setVenueSettings: async () => {
    const res = await fetch(`${API_URL}/store/settings`);
    const data = await res.json();
    set({ venueSettings: data });
  },
  setVenueRegularSchedule: async () => {
    const res = await fetch(`${API_URL}/store/wt`);
    const data = await res.json();
    set({ venueRegularSchedule: data });
  },
}));
