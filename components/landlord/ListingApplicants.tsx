"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Filter, MailOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  ApplicantCard,
  evaluateMatch,
} from "@/components/landlord/ApplicantCard";
import { decodeApplication, type ApplicationData } from "@/lib/encoding";
import {
  listApplicationsForListing,
  listingIdFromEncoded,
} from "@/lib/applications-store";
import { type Listing } from "@/lib/listing";

export function ListingApplicants({
  listing,
  listingEncoded,
}: {
  listing: Listing;
  listingEncoded: string;
}) {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filterOn, setFilterOn] = useState(false);
  const listingId = listingIdFromEncoded(listingEncoded);

  useEffect(() => {
    const encoded = listApplicationsForListing(listingId);
    const decoded = encoded
      .map((s) => decodeApplication(s))
      .filter((a): a is ApplicationData => a !== null);
    setApplications(decoded);

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes(listingId)) {
        const next = listApplicationsForListing(listingId);
        const nextDecoded = next
          .map((s) => decodeApplication(s))
          .filter((a): a is ApplicationData => a !== null);
        setApplications(nextDecoded);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [listingId]);

  const requiredKeys = useMemo(
    () =>
      new Set(
        Object.entries(listing.preferences)
          .filter(([, p]) => p === "required")
          .map(([k]) => k)
      ),
    [listing.preferences]
  );

  const evaluated = applications.map((a) => ({
    applicant: a,
    match: evaluateMatch(a, requiredKeys),
  }));

  const visible = filterOn
    ? evaluated.filter((m) => m.match.missing.length === 0)
    : evaluated;

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 lg:py-14">
      <Link
        href={`/landlord/listings/${listingEncoded}`}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="size-3.5" />
        Back to listing
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
            Applications · {listing.title}
          </div>
          <div className="font-display mt-1 text-3xl font-medium tracking-tight text-white">
            {visible.length} of {applications.length}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            All applications submitted through this listing — matching or not,
            verified or not.
          </p>
        </div>
        {applications.length > 0 && requiredKeys.size > 0 && (
          <label className="inline-flex items-center gap-2.5 rounded-full bg-slate-900/60 ring-1 ring-white/10 px-3 py-2 backdrop-blur cursor-pointer">
            <Filter className="size-3.5 text-slate-400" />
            <span className="text-xs text-slate-300">Filter to matches</span>
            <Switch
              size="sm"
              checked={filterOn}
              onCheckedChange={(c: boolean) => setFilterOn(c)}
            />
          </label>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 ring-1 ring-white/10">
            <MailOpen className="size-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-display mt-4 text-xl font-medium tracking-tight text-white">
            No applications yet.
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Share the listing link with prospective tenants. Applications
            submitted from this listing will land here automatically.
          </p>
          <Link
            href={`/landlord/listings/${listingEncoded}`}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="size-3" />
            Back to listing
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map(({ applicant, match }) => (
              <ApplicantCard
                key={applicant.createdAt + applicant.firstName}
                applicant={applicant}
                match={requiredKeys.size > 0 ? match : null}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {visible.length === 0 && applications.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-12 text-center text-sm text-slate-500">
          No applicants meet every required criterion.
          <button
            onClick={() => setFilterOn(false)}
            className="block mx-auto mt-3 text-emerald-300 text-xs underline-offset-4 hover:underline"
          >
            Show all applicants
          </button>
        </div>
      )}
    </div>
  );
}
