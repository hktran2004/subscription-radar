import Link from "next/link";
import { notFound } from "next/navigation";
import { detectSubscriptions } from "@/lib/detectSubscriptions";
import { addDays, formatCurrency, formatDate } from "@/lib/format";
import { getAccountTransactions } from "@/lib/transactions";
import { getAccount } from "@/lib/accounts";
import { CalendarCheckIcon, ChevronIcon } from "@/components/icons";
import { CategoryIcon } from "@/components/CategoryIcon";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ accountId: string; id: string }>;
}) {
  const { accountId, id } = await params;
  const account = getAccount(accountId);
  if (!account) notFound();

  const transactions = getAccountTransactions(account.id);
  const txn = transactions.find((t) => t.id === id);
  if (!txn) notFound();

  const subscriptions = account.hasSubscriptionRadar ? detectSubscriptions(transactions) : [];
  const isRecurring = subscriptions.some((s) => s.merchant === txn.merchant);

  const details: [string, string][] = [
    ["Type", "Sale"],
    ["Transaction date", formatDate(txn.date)],
    ["Posted date", formatDate(addDays(txn.date, 1))],
    ["Description", txn.merchant],
    ["Category", txn.category],
    ["Card", `${account.name} (••••${account.last4})`],
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-1">
        <Link
          href={`/account/${account.id}`}
          aria-label="Back to account"
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 active:bg-slate-100"
        >
          <ChevronIcon className="h-5 w-5 rotate-180" />
        </Link>
        <h1 className="text-lg font-bold text-ink">Transaction Details</h1>
      </header>

      <section className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-300 text-slate-500">
          <CategoryIcon category={txn.category} className="h-7 w-7" />
        </span>
        <p className="mt-3 text-lg font-bold text-ink">{txn.merchant}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-ink">{formatCurrency(txn.amount)}</p>

        {isRecurring && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-chase-chip px-2 py-1 text-xs text-chase-gray">
            <CalendarCheckIcon className="h-3.5 w-3.5 shrink-0" />
            This is a recurring charge.
          </span>
        )}
      </section>

      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm last:border-0"
          >
            <span className="text-chase-gray">{label}</span>
            <span className="font-medium text-ink">{value}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
