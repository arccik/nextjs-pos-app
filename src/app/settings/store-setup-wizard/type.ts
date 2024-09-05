export interface StoreData {
  name: string;
  serviceFee: number;
  address: string;
  logo: string;
}

export interface StepProps {
  data: StoreData;
  updateFields: (fields: Partial<StoreData>) => void;
}

export interface Step {
  title: string;
  component: React.FC<StepProps>;
}
