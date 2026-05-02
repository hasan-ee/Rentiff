"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { useUserRole } from "@/lib/use-role";

export function RoleAwareApplyCTA({
  listingId,
}: {
  listingId: string;
}) {
  const { role, hydrated } = useUserRole();

  if (!hydrated) {
    return <div className="h-14 w-64 mx-auto rounded-2xl bg-white/5 animate-pulse" />;
  }

  if (role === "landlord") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur px-5 py-3 text-sm text-slate-300">
          <Eye className="size-4 text-emerald-300" />
          You&apos;re viewing as a landlord — applications are submitted by
          tenants.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        href={`/apply?listing=${listingId}`}
        className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)]"
      >
        Apply for this listing
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </Link>
      <p className="text-[11px] text-slate-500">
        Building takes about three minutes. You can verify with DigiD, Tink,
        UWV, and more.
      </p>
    </div>
  );
}

export function TenantOnlyHeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { role, hydrated } = useUserRole();
  if (!hydrated || role === "landlord") return null;
  return (
    <Link
      href={href}
      className="text-xs font-medium text-slate-400 hover:text-white transition"
    >
      {children}
    </Link>
  );
}
