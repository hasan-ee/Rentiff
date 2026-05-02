import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight, Building2, ShieldAlert, ShieldCheck } from "lucide-react";
import { decodeListing } from "@/lib/listing";
import { ListingDashboard } from "@/components/landlord/ListingDashboard";

type PageProps = { params: { id: string } };

export function generateMetadata({ params }: PageProps) {
  const listing = decodeListing(params.id);
  if (!listing) return { title: "Listing — Rentiff" };
  return { title: `${listing.title} — applicants` };
}

export default function ListingDashboardPage({ params }: PageProps) {
  const listing = decodeListing(params.id);

  if (!listing) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
            <ShieldAlert className="size-6" strokeWidth={2} />
          </div>
          <h1 className="font-display mt-5 text-2xl font-medium tracking-tight text-white">
            Listing not found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            The link may be malformed. Try recreating the listing.
          </p>
          <Link
            href="/landlord/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            <Building2 className="size-4" />
            Create a new listing
          </Link>
        </div>
      </main>
    );
  }

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const tenantUrl = `${proto}://${host}/listing/${params.id}`;

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[400px] bg-[radial-gradient(40%_50%_at_50%_-10%,rgb(16_185_129_/_0.10)_0%,transparent_70%)]"
      />
      <div aria-hidden className="grid-dots pointer-events-none fixed inset-0 -z-0" />

      <header className="relative z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </span>
            <span className="font-display font-medium tracking-tight text-white">
              Rentiff
            </span>
          </Link>
          <Link
            href="/landlord"
            className="text-xs font-medium text-slate-400 hover:text-white transition"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <ListingDashboard
        listing={listing}
        listingEncoded={params.id}
        tenantUrl={tenantUrl}
      />
    </main>
  );
}
