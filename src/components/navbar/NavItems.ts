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

export default [
  {
    id: 1,
    title: "Dashboard",
    icon: HomeIcon,
    link: "/",
  },
  {
    id: 2,
    title: "Orders",
    icon: ConciergeBell,
    link: "/orders",
  },
  {
    id: 3,
    title: "Tables",
    icon: TableIcon,
    link: "/tables",
  },
  {
    id: 4,
    title: "Menu",
    icon: BookOpenText,
    link: "/menu",
  },

  {
    id: 345345,
    title: "Waiter",
    icon: Play,
    link: "/waiter",
  },
  {
    id: 41452,
    title: "Reservations",
    icon: BookMarked,
    link: "/reservations",
  },
  {
    id: 23,
    title: "Kitchen",
    icon: ChefIcon,
    link: "/kitchen",
  },
  {
    id: 242,
    title: "Menu Items",
    icon: Ham,
    link: "/items",
  },
  {
    id: 5,
    title: "Analytics",
    icon: LineChart,
    link: "/analytics",
  },
  {
    id: 1255,
    title: "Users",
    icon: Users2Icon,
    link: "/user",
  },
  {
    id: 1255,
    title: "Rota",
    icon: SquareChevronDown,
    link: "/user/rota",
  },
];
