import rawTransactions from "@/data/mock_transactions.json";
import { detectSubscriptions, totalMonthlySpend } from "@/lib/detectSubscriptions";
import { formatCurrency } from "@/lib/format";
import { SubscriptionList } from "@/components/SubscriptionList";
import { Transaction } from "@/lib/types";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { BackButton } from "@/components/BackButton";

export default function SubscriptionsHubPage() {
  const transactions = rawTransactions as Transaction[];
  const subscriptions = detectSubscriptions(transactions);
  const total = totalMonthlySpend(subscriptions);
  const increasedCount = subscriptions.filter((s) => s.priceIncreased).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-1">
        <BackButton label="Go back" />
        <div>
          <h1 className="text-lg font-bold text-ink">Subscription Radar</h1>
          <p className="text-sm text-chase-gray">Recurring charges on Sapphire Preferred</p>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-chase-gray">Total monthly subscription spend</p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-ink">{formatCurrency(total)}</p>

        {increasedCount > 0 ? (
          <div className="mt-3 flex items-start gap-2 text-sm font-medium text-chase-red">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {increasedCount} subscription{increasedCount > 1 ? "s" : ""} increased in price this
              cycle.
            </span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-chase-green">
            <CheckIcon className="h-4 w-4 shrink-0" />
            <span>No price changes this cycle.</span>
          </div>
        )}

        <div className="mt-4 flex divide-x divide-slate-200 border-t border-slate-100 pt-4">
          <div className="flex-1 pr-4">
            <p className="text-2xl font-bold tabular-nums text-ink">{subscriptions.length}</p>
            <p className="text-xs text-chase-gray">Subscriptions detected</p>
          </div>
          <div className="flex-1 pl-4">
            <p className="text-2xl font-bold tabular-nums text-ink">{increasedCount}</p>
            <p className="text-xs text-chase-gray">Price increases</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="px-1 text-lg font-bold text-ink">Subscriptions</h2>
        <SubscriptionList subscriptions={subscriptions} />
      </section>
    </main>
  );
}
