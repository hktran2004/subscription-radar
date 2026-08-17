import { BillingFrequency, DetectedSubscription, Transaction } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Day-gap ranges for each supported billing cadence. Ranges are chosen with
 * enough slack to absorb calendar noise (28-31 day months, weekend shifts,
 * processor delays) while staying far enough apart that no gap can satisfy
 * two cadences at once.
 */
const FREQUENCY_WINDOWS: { frequency: BillingFrequency; min: number; max: number }[] = [
  { frequency: "weekly", min: 5, max: 9 },
  { frequency: "biweekly", min: 11, max: 17 },
  { frequency: "monthly", min: 26, max: 34 },
  { frequency: "quarterly", min: 80, max: 100 },
];

const MONTHLY_MULTIPLIER: Record<BillingFrequency, number> = {
  weekly: 30 / 7,
  biweekly: 30 / 14,
  monthly: 1,
  quarterly: 1 / 3,
};

const AMOUNT_EPSILON = 0.005;

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / MS_PER_DAY);
}

function classifyGap(days: number): BillingFrequency | null {
  const match = FREQUENCY_WINDOWS.find((w) => days >= w.min && days <= w.max);
  return match ? match.frequency : null;
}

/**
 * Collapses a sequence of amounts into runs of equal (within epsilon) value.
 * A clean subscription with at most one price change should collapse into
 * one or two runs. Anything that bounces between values (groceries, gas)
 * collapses into many runs and gets rejected.
 */
function computeRuns(amounts: number[]): { value: number; startIndex: number }[] {
  const runs: { value: number; startIndex: number }[] = [];
  amounts.forEach((amount, index) => {
    const last = runs[runs.length - 1];
    if (!last || Math.abs(amount - last.value) > AMOUNT_EPSILON) {
      runs.push({ value: amount, startIndex: index });
    }
  });
  return runs;
}

export function detectSubscriptions(transactions: Transaction[]): DetectedSubscription[] {
  const byMerchant = new Map<string, Transaction[]>();
  for (const txn of transactions) {
    const list = byMerchant.get(txn.merchant) ?? [];
    list.push(txn);
    byMerchant.set(txn.merchant, list);
  }

  const results: DetectedSubscription[] = [];

  for (const [merchant, txns] of byMerchant) {
    if (txns.length < 2) continue;

    const sorted = [...txns].sort((a, b) => a.date.localeCompare(b.date));

    const gaps = sorted.slice(1).map((txn, i) => daysBetween(sorted[i].date, txn.date));
    const gapFrequencies = gaps.map(classifyGap);
    if (gapFrequencies.some((f) => f === null)) continue;

    const frequency = gapFrequencies[0] as BillingFrequency;
    if (gapFrequencies.some((f) => f !== frequency)) continue;

    const amounts = sorted.map((t) => t.amount);
    const runs = computeRuns(amounts);
    if (runs.length > 2) continue;

    const firstAmount = runs[0].value;
    const currentAmount = runs[runs.length - 1].value;
    const priceIncreased = runs.length === 2 && currentAmount > firstAmount + AMOUNT_EPSILON;
    const priceIncrease = priceIncreased
      ? { from: firstAmount, to: currentAmount, date: sorted[runs[1].startIndex].date }
      : null;

    const firstDate = sorted[0].date;
    const lastDate = sorted[sorted.length - 1].date;
    const monthlyEquivalent = currentAmount * MONTHLY_MULTIPLIER[frequency];

    results.push({
      merchant,
      frequency,
      currentAmount,
      firstAmount,
      firstDate,
      lastDate,
      occurrences: sorted.length,
      monthlyEquivalent,
      priceIncreased,
      priceIncrease,
      confidence: sorted.length >= 3 ? "high" : "medium",
      transactions: sorted,
    });
  }

  return results.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent);
}

export function totalMonthlySpend(subscriptions: DetectedSubscription[]): number {
  return subscriptions.reduce((sum, s) => sum + s.monthlyEquivalent, 0);
}
