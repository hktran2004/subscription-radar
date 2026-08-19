"use client";

import { useRouter } from "next/navigation";
import { ChevronIcon } from "@/components/icons";

export function BackButton({ label = "Go back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 active:bg-slate-100"
    >
      <ChevronIcon className="h-5 w-5 rotate-180" />
    </button>
  );
}
