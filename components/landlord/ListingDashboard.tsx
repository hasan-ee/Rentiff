"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Check,
  Copy,
  Eye,
  Image as ImageIcon,
  MailOpen,
  MapPin,
} from "lucide-react";
import {
  listApplicationsForListing,
  listingIdFromEncoded,
} from "@/lib/applications-store";
import { type Listing } from "@/lib/listing";

export function ListingDashboard({
  listing,
  listingEncoded,
  tenantUrl,
}: {
  listing: Listing;
  listingEncoded: string;
  tenantUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);

  const listingId = listingIdFromEncoded(listingEncoded);

  useEffect(() => {
    setApplicantCount(listApplicationsForListing(listingId).length);
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes(listingId)) {
        setApplicantCount(listApplicationsForListing(listingId).length);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [listingId]);

  function handleCopy() {
    navigator.clipboard.writeText(tenantUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const cover = listing.photos?.[0];

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 lg:py-14">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-medium">
          Live listing
        </div>
        <h1 className="font-display mt-1 text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {listing.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
          <span>
            <span className="font-semibold text-white">
              €{listing.rent.toLocaleString("nl-NL")}
            </span>{" "}
            / month
          </span>
          {listing.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4 text-emerald-300" />
              {listing.bedrooms} bedroom{listing.bedrooms === 1 ? "" : "s"}
            </span>
          )}
          {listing.address && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-emerald-300" />
              {listing.address}
            </span>
          )}
        </div>
      </div>

      {listing.photos && listing.photos.length > 0 && (
        <div className="mt-6">
          <PhotoGrid photos={listing.photos} title={listing.title} />
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href={`/landlord/listings/${listingEncoded}/applicants`}
          className="group rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-6 transition hover:border-white/20"
        >
          <div className="flex items-center gap-2 text-emerald-300">
            <MailOpen className="size-4" />
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
              Applications
            </span>
          </div>
          <div className="mt-3 font-display text-3xl font-medium tracking-tight text-white">
            {applicantCount}
          </div>
          <div className="text-xs text-slate-400">
            {applicantCount === 0
              ? "No applications yet"
              : "Submitted to this listing"}
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-300 group-hover:translate-x-0.5 transition">
            View applications
            <ArrowRight className="size-4" />
          </div>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
            Share with prospects
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <code className="truncate rounded-lg bg-slate-950/80 ring-1 ring-white/10 px-3 py-2 text-[11px] text-slate-300 font-mono">
              {tenantUrl}
            </code>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 ring-1 ring-white/15 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
              >
                {copied ? (
                  <>
                    <Check className="size-3" strokeWidth={3} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy
                  </>
                )}
              </button>
              <Link
                href={`/listing/${listingEncoded}`}
                target="_blank"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-emerald-950 transition hover:bg-emerald-400"
              >
                <Eye className="size-3" />
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoGrid({ photos, title }: { photos: string[]; title: string }) {
  return (
    <div
      className={`grid gap-2 ${
        photos.length === 1
          ? "grid-cols-1"
          : photos.length === 2
            ? "grid-cols-2"
            : photos.length === 3
              ? "grid-cols-2 md:grid-cols-3"
              : "grid-cols-2 md:grid-cols-4"
      }`}
    >
      {photos.map((src, i) => (
        <PhotoTile key={i} src={src} alt={`${title} – photo ${i + 1}`} />
      ))}
    </div>
  );
}

function PhotoTile({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10 bg-slate-800">
      {errored ? (
        <div className="h-full w-full flex items-center justify-center text-slate-700">
          <ImageIcon className="size-7" strokeWidth={1.25} />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
