import Link from "next/link";
import rawTransactions from "@/data/mock_transactions.json";
import { detectSubscriptions, totalMonthlySpend } from "@/lib/detectSubscriptions";
import { formatCurrency, formatDate } from "@/lib/format";
import { groupTransactionsByDate } from "@/lib/transactions";
import { Transaction } from "@/lib/types";
import { ChevronIcon, RecurringIcon } from "@/components/icons";
import { CardArt } from "@/components/CardArt";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SAPPHIRE_ACCOUNT } from "@/lib/accounts";

const QUICK_ACTIONS = ["Manage account", "Lock/unlock card", "Pay card", "Statements"];

export default function AccountPage() {
  const transactions = rawTransactions as Transaction[];
  const subscriptions = detectSubscriptions(transactions);
  const total = totalMonthlySpend(subscriptions);
  const increasedCount = subscriptions.filter((s) => s.priceIncreased).length;
  const groups = groupTransactionsByDate(transactions);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-1">
        <Link
          href="/"
          aria-label="Back to accounts"
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 active:bg-slate-100"
        >
          <ChevronIcon className="h-5 w-5 rotate-180" />
        </Link>
        <h1 className="text-lg font-bold text-ink">
          {SAPPHIRE_ACCOUNT.name} (••••{SAPPHIRE_ACCOUNT.last4})
        </h1>
      </header>

      <CardArt size="lg" />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {QUICK_ACTIONS.map((label) => (
          <span
            key={label}
            className="shrink-0 whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-chase-blue"
          >
            {label}
          </span>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-chase-gray">Current balance</p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-ink">
          {formatCurrency(SAPPHIRE_ACCOUNT.currentBalance)}
        </p>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-chase-gray">Minimum payment due</span>
            <span className="font-semibold tabular-nums text-ink">
              {formatCurrency(SAPPHIRE_ACCOUNT.minimumPaymentDue)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-chase-gray">Payment due date</span>
            <span className="font-semibold text-ink">{SAPPHIRE_ACCOUNT.paymentDueDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-chase-gray">Remaining statement balance</span>
            <span className="font-semibold tabular-nums text-ink">
              {formatCurrency(SAPPHIRE_ACCOUNT.remainingStatementBalance)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-chase-gray">Automatic payments</span>
            <span className="font-semibold text-ink">{SAPPHIRE_ACCOUNT.autoPay}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-full border border-slate-300 py-3 text-center text-sm font-semibold text-chase-blue">
            See statements
          </span>
          <span className="flex-1 rounded-full bg-chase-blue-solid py-3 text-center text-sm font-semibold text-white">
            Pay card
          </span>
        </div>
      </section>

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

      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-ink">Transactions</h2>
          <span className="text-sm font-medium text-chase-blue">Search</span>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          {groups.map((group) => (
            <div key={group.date}>
              <div className="bg-slate-50 px-4 py-1.5 text-xs font-medium text-chase-gray">
                {formatDate(group.date)}
              </div>
              <ul>
                {group.transactions.map((txn) => (
                  <li key={txn.id} className="border-b border-slate-100 last:border-0">
                    <Link
                      href={`/account/transactions/${txn.id}`}
                      className="flex items-center gap-3 px-4 py-3 active:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                        <CategoryIcon category={txn.category} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                        {txn.merchant}
                      </span>
                      <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-chase-blue">
                        {formatCurrency(txn.amount)}
                      </span>
                      <ChevronIcon className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
