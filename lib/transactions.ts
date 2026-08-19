import sapphireTransactions from "@/data/mock_transactions.json";
import freedomFlexTransactions from "@/data/freedom_flex_transactions.json";
import { AccountId } from "./accounts";
import { Transaction } from "./types";

const TRANSACTIONS_BY_ACCOUNT: Record<AccountId, Transaction[]> = {
  "sapphire-preferred": sapphireTransactions as Transaction[],
  "freedom-flex": freedomFlexTransactions as Transaction[],
};

export function getAccountTransactions(accountId: AccountId): Transaction[] {
  return TRANSACTIONS_BY_ACCOUNT[accountId];
}

export function groupTransactionsByDate(transactions: Transaction[]): { date: string; transactions: Transaction[] }[] {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  const groups: { date: string; transactions: Transaction[] }[] = [];
  for (const txn of sorted) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === txn.date) {
      lastGroup.transactions.push(txn);
    } else {
      groups.push({ date: txn.date, transactions: [txn] });
    }
  }
  return groups;
}
