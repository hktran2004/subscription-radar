import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { ChevronIcon, ProfileIcon, SearchIcon } from "@/components/icons";
import { CardArt } from "@/components/CardArt";
import { FREEDOM_FLEX_ACCOUNT, SAPPHIRE_ACCOUNT } from "@/lib/accounts";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-6">
      <header className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-sm text-slate-400">What are you looking for?</span>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
          <ProfileIcon className="h-5 w-5" />
        </span>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="px-1 text-2xl font-bold text-ink">Accounts</h2>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-r from-chase-navy to-chase-navy-light px-4 py-3">
            <p className="text-base font-bold text-white">Credit cards (2)</p>
          </div>

          <Link href="/account" className="block border-b border-slate-100 px-4 py-4 active:bg-slate-50">
            <span className="mb-3 flex items-center gap-1 text-base text-ink">
              {SAPPHIRE_ACCOUNT.name} (••••{SAPPHIRE_ACCOUNT.last4})
              <ChevronIcon className="h-4 w-4 text-slate-400" />
            </span>

            <span className="flex items-center gap-4">
              <CardArt size="sm" variant="sapphire" />
              <span className="flex-1 text-right">
                <span className="block text-3xl font-bold tabular-nums text-ink">
                  {formatCurrency(SAPPHIRE_ACCOUNT.currentBalance)}
                </span>
                <span className="block text-sm text-chase-gray">Current balance</span>
              </span>
            </span>
          </Link>

          <div className="px-4 py-4">
            <span className="mb-3 flex items-center gap-1 text-base text-ink">
              {FREEDOM_FLEX_ACCOUNT.name} (••••{FREEDOM_FLEX_ACCOUNT.last4})
            </span>

            <span className="flex items-center gap-4">
              <CardArt size="sm" variant="freedom" />
              <span className="flex-1 text-right">
                <span className="block text-3xl font-bold tabular-nums text-ink">
                  {formatCurrency(FREEDOM_FLEX_ACCOUNT.currentBalance)}
                </span>
                <span className="block text-sm text-chase-gray">Current balance</span>
              </span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
