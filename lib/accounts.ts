export type AccountId = "sapphire-preferred" | "freedom-flex";

export type Account = {
  id: AccountId;
  name: string;
  last4: string;
  cardVariant: "sapphire" | "freedom";
  currentBalance: number;
  minimumPaymentDue: number;
  paymentDueDate: string;
  remainingStatementBalance: number;
  autoPay: "On" | "Off";
  hasSubscriptionRadar: boolean;
};

export const ACCOUNTS: Record<AccountId, Account> = {
  "sapphire-preferred": {
    id: "sapphire-preferred",
    name: "Sapphire Preferred",
    last4: "4242",
    cardVariant: "sapphire",
    currentBalance: 187.42,
    minimumPaymentDue: 25.0,
    paymentDueDate: "Sep 12, 2026",
    remainingStatementBalance: 142.1,
    autoPay: "Off",
    hasSubscriptionRadar: true,
  },
  "freedom-flex": {
    id: "freedom-flex",
    name: "Freedom Flex",
    last4: "1234",
    cardVariant: "freedom",
    currentBalance: 23.55,
    minimumPaymentDue: 23.55,
    paymentDueDate: "Sep 5, 2026",
    remainingStatementBalance: 0,
    autoPay: "On",
    hasSubscriptionRadar: false,
  },
};

export function getAccount(id: string): Account | undefined {
  return ACCOUNTS[id as AccountId];
}
