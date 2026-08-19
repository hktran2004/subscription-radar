"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, PlanIcon, StarIcon, WalletIcon } from "@/components/icons";

const INERT_TABS = [
  { label: "Benefits & travel", icon: StarIcon },
  { label: "More", icon: MenuIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAccounts = pathname === "/" || pathname.startsWith("/account");
  const isPlanTrack = pathname.startsWith("/plan") || pathname.startsWith("/subscriptions");

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-md items-start justify-around px-2 py-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-2 ${isAccounts ? "text-chase-blue-solid" : "text-slate-500"}`}
        >
          <WalletIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Accounts</span>
        </Link>

        <Link
          href="/plan"
          className={`flex flex-col items-center gap-1 px-2 ${isPlanTrack ? "text-chase-blue-solid" : "text-slate-500"}`}
        >
          <PlanIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Plan & track</span>
        </Link>

        {INERT_TABS.map(({ label, icon: Icon }) => (
          <span key={label} className="flex flex-col items-center gap-1 px-2 text-slate-500">
            <Icon className="h-6 w-6" />
            <span className="text-xs">{label}</span>
          </span>
        ))}
      </div>
    </nav>
  );
}
