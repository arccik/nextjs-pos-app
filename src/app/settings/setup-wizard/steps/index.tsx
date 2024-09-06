import { Info, MapPin, Phone, DollarSign, Users, User } from "lucide-react";
import { Step } from "../type";
import BasicInfoStep from "./BasicInfoStep";
import ContactStep from "./ContactStep";
import DetailsStep from "./DetailsStep";
import PaymentsStep from "./PaymentsStep";
import PermissionsStep from "./PermissionsStep";
import AdminSetupStep from "./UsersStep";

export const steps: Step[] = [
  {
    title: "Basic Info",
    icon: <Info className="h-6 w-6" />,
    component: BasicInfoStep,
  },
  {
    title: "Contact",
    icon: <Phone className="h-6 w-6" />,
    component: ContactStep,
  },
  {
    title: "Details",
    icon: <MapPin className="h-6 w-6" />,
    component: DetailsStep,
  },
  {
    title: "Administrator",
    icon: <User className="h-6 w-6" />,
    component: AdminSetupStep,
  },
  {
    title: "Payments",
    icon: <DollarSign className="h-6 w-6" />,
    component: PaymentsStep,
  },
  {
    title: "Permissions",
    icon: <Users className="h-6 w-6" />,
    component: PermissionsStep,
  },
];
