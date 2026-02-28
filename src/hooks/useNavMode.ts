import useLocalStorage from "./useLocalStorage";

export type NavMode = "sidebar" | "touch";

export default function useNavMode() {
  return useLocalStorage<NavMode>("pos-nav-mode", "sidebar");
}
