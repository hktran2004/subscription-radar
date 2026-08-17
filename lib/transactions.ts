import { Transaction } from "./types";

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
