"use client";

import { useState } from "react";
import { DetectedSubscription } from "@/lib/types";
import { formatCurrency, formatDate, FREQUENCY_LABEL } from "@/lib/format";
import { AlertIcon, CalendarCheckIcon, ChevronIcon, RecurringIcon } from "@/components/icons";

function SubscriptionRow({ sub }: { sub: DetectedSubscription }) {
  const [expanded, setExpanded] = useState(false);

  const meta = [FREQUENCY_LABEL[sub.frequency], `${sub.occurrences} charges`];
  if (sub.confidence === "medium") meta.push("Limited history");

  return (
    <li className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-start gap-3 py-3.5 text-left active:bg-slate-50"
      >
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
          <RecurringIcon className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="text-base font-bold leading-snug text-ink">{sub.merchant}</span>
            <span className="whitespace-nowrap text-base font-bold tabular-nums text-chase-blue">
              {formatCurrency(sub.currentAmount)}
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-chase-gray">{meta.join(" · ")}</span>

          {sub.priceIncreased && sub.priceIncrease && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-chase-red">
              <AlertIcon className="h-3.5 w-3.5 shrink-0" />
              Price increased {formatCurrency(sub.priceIncrease.from)} → {formatCurrency(sub.priceIncrease.to)}
            </span>
          )}
        </span>

        <ChevronIcon
          className={`mt-1.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && (
        <div className="pb-4 pl-14">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-chase-chip px-2 py-1 text-xs text-chase-gray">
            <CalendarCheckIcon className="h-3.5 w-3.5 shrink-0" />
            Billed {formatDate(sub.firstDate)} – {formatDate(sub.lastDate)}
          </span>
          <ul className="flex flex-col">
            {sub.transactions.map((txn) => (
              <li
                key={txn.id}
                className="flex items-center justify-between border-t border-slate-100 py-2 text-sm first:border-0"
              >
                <span className="text-chase-gray">{formatDate(txn.date)}</span>
                <span className="font-semibold tabular-nums text-chase-blue">{formatCurrency(txn.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function SubscriptionList({ subscriptions }: { subscriptions: DetectedSubscription[] }) {
  if (subscriptions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-chase-gray">
        No recurring subscriptions detected in this statement.
      </p>
    );
  }

  return (
    <ul className="rounded-2xl bg-white px-4 shadow-sm ring-1 ring-black/5">
      {subscriptions.map((sub) => (
        <SubscriptionRow key={sub.merchant} sub={sub} />
      ))}
    </ul>
  );
}
