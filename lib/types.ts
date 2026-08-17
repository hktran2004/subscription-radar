export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
};

export type BillingFrequency = "weekly" | "biweekly" | "monthly" | "quarterly";

export type PriceIncrease = {
  from: number;
  to: number;
  date: string;
};

export type DetectedSubscription = {
  merchant: string;
  frequency: BillingFrequency;
  currentAmount: number;
  firstAmount: number;
  firstDate: string;
  lastDate: string;
  occurrences: number;
  monthlyEquivalent: number;
  priceIncreased: boolean;
  priceIncrease: PriceIncrease | null;
  confidence: "high" | "medium";
  transactions: Transaction[];
};
