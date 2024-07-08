import {
  HomeIcon,
  BookOpenText,
  LineChart,
  PersonStanding,
  ConciergeBell,
  Ham,
  BookMarked,
} from "lucide-react";
import TableIcon from "./TableIcon";
import ChefIcon from "./ChefIcon";

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
    icon: PersonStanding,
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
    link: "/admin/items",
  },
  {
    id: 5,
    title: "Analytics",
    icon: LineChart,
    link: "/reports",
  },
];
