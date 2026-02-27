import {
  HomeIcon,
  BookOpenText,
  LineChart,
  ConciergeBell,
  Ham,
  BookMarked,
  Users2Icon,
  Play,
  SquareChevronDown,
} from "lucide-react";

import TableIcon from "./TableIcon";
import ChefIcon from "./ChefIcon";
// import Waiter from "./WaiterIcon";

export type NavGroup = "Operations" | "Service" | "Admin";

export default [
  {
    id: 1,
    title: "Dashboard",
    icon: HomeIcon,
    link: "/",
    group: "Operations" as NavGroup,
  },
  {
    id: 3,
    title: "Tables",
    icon: TableIcon,
    link: "/tables",
    group: "Operations" as NavGroup,
  },
  {
    id: 2,
    title: "Orders",
    icon: ConciergeBell,
    link: "/orders",
    group: "Operations" as NavGroup,
  },
  {
    id: 23,
    title: "Kitchen",
    icon: ChefIcon,
    link: "/kitchen",
    group: "Operations" as NavGroup,
  },
  {
    id: 4,
    title: "Menu",
    icon: BookOpenText,
    link: "/menu",
    group: "Service" as NavGroup,
  },
  {
    id: 345345,
    title: "Waiter",
    icon: Play,
    link: "/waiter",
    group: "Service" as NavGroup,
  },
  {
    id: 41452,
    title: "Reservations",
    icon: BookMarked,
    link: "/reservations",
    group: "Service" as NavGroup,
  },
  {
    id: 242,
    title: "Menu Items",
    icon: Ham,
    link: "/items",
    group: "Admin" as NavGroup,
  },
  {
    id: 5,
    title: "Analytics",
    icon: LineChart,
    link: "/analytics",
    group: "Admin" as NavGroup,
  },
  {
    id: 1255,
    title: "Users",
    icon: Users2Icon,
    link: "/user",
    group: "Admin" as NavGroup,
  },
  {
    id: 12415,
    title: "Rota",
    icon: SquareChevronDown,
    link: "/user/rota",
    group: "Admin" as NavGroup,
  },
] as const;
