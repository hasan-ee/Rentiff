import { headers } from "next/headers";
import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { decodeApplication } from "@/lib/encoding";
import { SharedView } from "@/components/v/SharedView";

type PageProps = { params: { id: string } };

export function generateMetadata({ params }: PageProps) {
  const data = decodeApplication(params.id);
  if (!data) {
    return {
      title: "Invalid badge — Rentiff",
    };
  }
  const name = `${data.firstName} ${data.lastInitial}.`.trim();
  return {
    title: `${name}'s verified application — Rentiff`,
    description:
      "A verified tenant application shared via Rentiff. The tenant chose what to include.",
  };
}

export default function SharedBadgePage({ params }: PageProps) {
  const data = decodeApplication(params.id);

  if (!data) {
    return <InvalidBadge />;
  }

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const shareUrl = `${proto}://${host}/v/${params.id}`;

  return <SharedView data={data} shareUrl={shareUrl} />;
}

function InvalidBadge() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-8 text-center shadow-2xl">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
          <ShieldAlert className="size-6" strokeWidth={2} />
        </div>
        <h1 className="font-display mt-5 text-2xl font-medium tracking-tight text-white">
          This badge link is invalid
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The link may be malformed, expired, or the tenant has revoked it.
          Ask the tenant for a fresh link.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            <ShieldCheck className="size-4" />
            Create your own application
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
