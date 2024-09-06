export interface VenueData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  managerName: string;
  description: string;
  capacity: number;
  amenities: string;
  accessibilityInformation: string;
  logo: string;
  acceptCash: boolean;
  acceptCredit: boolean;
  acceptMobilePayment: boolean;
  alloweManagerToEditMenu: boolean;
  allowedChashierToRefund: boolean;
  allowedServersToModifyOrder: boolean;
  serviceFee: number;
  currency: string;
}

export interface StepProps {
  data: VenueData;
  updateFields: (fields: Partial<VenueData>) => void;
}

export interface Step {
  title: string;
  icon: React.ReactNode;
  component: React.FC<StepProps>;
}
