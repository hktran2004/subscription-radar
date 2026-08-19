import Link from "next/link";
import rawTransactions from "@/data/mock_transactions.json";
import { detectSubscriptions, totalMonthlySpend } from "@/lib/detectSubscriptions";
import { formatCurrency } from "@/lib/format";
import { Transaction } from "@/lib/types";
import { ChairIcon, ChartFrameIcon, ChevronIcon, RecurringIcon } from "@/components/icons";

export default function PlanPage() {
  const transactions = rawTransactions as Transaction[];
  const subscriptions = detectSubscriptions(transactions);
  const total = totalMonthlySpend(subscriptions);
  const increasedCount = subscriptions.filter((s) => s.priceIncreased).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-6">
      <header>
        <h1 className="text-xl font-bold text-ink">Wealth Plan</h1>
        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-chase-gray">
          + External
        </span>
      </header>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="h-28 w-full bg-gradient-to-br from-sky-300 via-sky-200 to-emerald-200" />
        <div className="px-5 pb-5 pt-4 text-center">
          <p className="text-lg font-bold text-ink">Turn your dreams into goals</p>
          <p className="mt-2 text-sm text-chase-gray">
            Dreaming of retiring early? Or buying a home? Create a goal and start making it real.
          </p>
          <span className="mt-4 inline-block rounded-full bg-chase-blue-solid px-6 py-3 text-sm font-semibold text-white">
            Set up your first goal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-chase-chip text-chase-blue">
            <ChairIcon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-ink">Save for retirement with an IRA</p>
          <p className="mt-1.5 flex-1 text-xs text-chase-gray">
            Shape your strategy for the future with a tax-smart IRA.
          </p>
          <span className="mt-3 self-start rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
            Learn more
          </span>
        </div>

        <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-chase-chip text-chase-blue">
            <ChartFrameIcon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-ink">Earn up to $1,000 cash bonus</p>
          <p className="mt-1.5 flex-1 text-xs text-chase-gray">
            Open and fund a Self-Directed Investing account and get a bonus.
          </p>
          <span className="mt-3 self-start rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
            Learn more
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="px-1 text-lg font-bold text-ink">Track your money</h2>

        <div className="flex gap-1 rounded-full bg-chase-chip p-1 text-sm font-medium">
          <span className="flex-1 rounded-full bg-white py-2 text-center text-chase-blue shadow-sm">
            Monthly spending
          </span>
          <span className="flex-1 py-2 text-center text-chase-gray">Net worth history</span>
        </div>

        <Link
          href="/subscriptions"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 active:bg-slate-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chase-chip text-chase-blue">
            <RecurringIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-ink">Subscription Radar</span>
            <span className="block text-xs text-chase-gray">
              {subscriptions.length} recurring · {formatCurrency(total)}/mo
              {increasedCount > 0 ? ` · ${increasedCount} price increase${increasedCount > 1 ? "s" : ""}` : ""}
            </span>
          </span>
          <ChevronIcon className="h-5 w-5 shrink-0 text-slate-400" />
        </Link>
      </section>
    </main>
  );
}
