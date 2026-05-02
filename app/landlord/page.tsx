"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Image as ImageIcon,
  Lock,
  MailOpen,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import {
  decodeProfile,
  initialsFromName,
  LANDLORD_PROFILE_LOCAL_KEY,
  type LandlordProfile,
  yearsInBusiness,
} from "@/lib/landlord-profile";
import {
  averageRating,
  listReviewsForLandlord,
} from "@/lib/reviews-store";
import { profileIdFromEncoded } from "@/lib/landlord-profile";
import {
  listLandlordListings,
} from "@/lib/landlord-listings-store";
import {
  decodeListing,
  type Listing,
} from "@/lib/listing";
import {
  listApplicationsForListing,
  listingIdFromEncoded,
} from "@/lib/applications-store";

type SavedListing = {
  encoded: string;
  listing: Listing;
  applicantCount: number;
};

export default function LandlordHubPage() {
  const [profile, setProfile] = useState<LandlordProfile | null>(null);
  const [profileEncoded, setProfileEncoded] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<{
    avg: number | null;
    count: number;
  }>({ avg: null, count: 0 });
  const [listings, setListings] = useState<SavedListing[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANDLORD_PROFILE_LOCAL_KEY);
      if (stored) {
        const decoded = decodeProfile(stored);
        if (decoded) {
          setProfile(decoded);
          setProfileEncoded(stored);
          const reviews = listReviewsForLandlord(profileIdFromEncoded(stored));
          setReviewSummary({
            avg: averageRating(reviews),
            count: reviews.length,
          });
        }
      }
    } catch {
      // ignore
    }
    const encodedListings = listLandlordListings();
    const decoded = encodedListings
      .map((enc) => {
        const l = decodeListing(enc);
        if (!l) return null;
        const applicantCount = listApplicationsForListing(
          listingIdFromEncoded(enc)
        ).length;
        return { encoded: enc, listing: l, applicantCount };
      })
      .filter((x): x is SavedListing => x !== null);
    setListings(decoded);
    setHydrated(true);
  }, []);

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
          <div className="text-xs text-slate-400 hidden sm:block">
            Landlord hub
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 lg:py-14">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-white"
        >
          Find tenants you can{" "}
          <span className="italic text-emerald-300">trust</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-3 text-slate-300 max-w-xl"
        >
          Build your trust profile, publish listings with the criteria you
          care about, and review applications that arrive complete and
          comparable.
        </motion.p>

        <section className="mt-10">
          <SectionHeader
            eyebrow="Step 1"
            title="Your trust profile"
          />
          <div className="mt-4">
            {hydrated ? (
              profile && profileEncoded ? (
                <ProfileSummaryCard
                  profile={profile}
                  profileEncoded={profileEncoded}
                  reviewAvg={reviewSummary.avg}
                  reviewCount={reviewSummary.count}
                />
              ) : (
                <ProfileEmpty />
              )
            ) : (
              <SkeletonCard />
            )}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader eyebrow="Step 2" title="Your listings" />

          {!hydrated ? (
            <SkeletonCard />
          ) : !profile ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Lock className="size-4 text-slate-500" />
                Build your profile first to start publishing listings.
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Link
                  href="/landlord/new"
                  className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.10] to-transparent p-6 backdrop-blur transition hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.20)]"
                >
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Building2 className="size-4" />
                    <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
                      New listing
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-medium tracking-tight text-white">
                    Create a listing template
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Set rent, photos, and your verification preferences. Get
                    a shareable link in under 2 minutes.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-300 group-hover:translate-x-0.5 transition">
                    Start
                    <ArrowRight className="size-4" />
                  </div>
                </Link>

                <SummaryStat
                  count={listings.length}
                  label={listings.length === 1 ? "listing" : "listings"}
                  applicantTotal={listings.reduce(
                    (acc, l) => acc + l.applicantCount,
                    0
                  )}
                />
              </div>

              {listings.length > 0 && (
                <div className="mt-6">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                    Active listings
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <AnimatePresence initial={false}>
                      {listings.map((l) => (
                        <ListingTile key={l.encoded} item={l} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl font-medium tracking-tight text-white">
        {title}
      </h2>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 h-32 animate-pulse" />
  );
}

function ProfileEmpty() {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-6 backdrop-blur flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
        <User className="size-5" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-white">Build your trust profile</div>
        <p className="mt-0.5 text-xs text-slate-400 max-w-md">
          Show your track record, properties, and verified reviews. Required
          before publishing a listing.
        </p>
      </div>
      <Link
        href="/landlord/profile/new"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
      >
        Start
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function ProfileSummaryCard({
  profile,
  profileEncoded,
  reviewAvg,
  reviewCount,
}: {
  profile: LandlordProfile;
  profileEncoded: string;
  reviewAvg: number | null;
  reviewCount: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur flex flex-col sm:flex-row sm:items-center gap-4">
      <Avatar profile={profile} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-medium">
            Verified landlord
          </span>
        </div>
        <div className="font-display text-xl font-medium tracking-tight text-white truncate mt-0.5">
          {profile.name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>
            {yearsInBusiness(profile)} yr in business
          </span>
          <span>·</span>
          <span>{profile.propertyCount} properties</span>
          {reviewAvg !== null && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-white font-semibold">{reviewAvg}</span>
                <span>
                  ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                </span>
              </span>
            </>
          )}
        </div>
      </div>
      <Link
        href={`/landlord/profile/${profileEncoded}`}
        className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 ring-1 ring-white/15 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-white/15"
      >
        View public profile
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function Avatar({ profile }: { profile: LandlordProfile }) {
  const [errored, setErrored] = useState(false);
  if (profile.profilePhotoUrl && !errored) {
    return (
      <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.profilePhotoUrl}
          alt={profile.name}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-emerald-700/40 ring-1 ring-emerald-500/30 text-white">
      <span className="font-display text-base font-medium">
        {initialsFromName(profile.name) || "R"}
      </span>
    </div>
  );
}

function SummaryStat({
  count,
  label,
  applicantTotal,
}: {
  count: number;
  label: string;
  applicantTotal: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur grid grid-cols-2 gap-4">
      <div>
        <div className="font-display text-3xl font-medium tracking-tight text-white">
          {count}
        </div>
        <div className="text-xs text-slate-400">Active {label}</div>
      </div>
      <div>
        <div className="font-display text-3xl font-medium tracking-tight text-white">
          {applicantTotal}
        </div>
        <div className="text-xs text-slate-400">Applications received</div>
      </div>
    </div>
  );
}

function ListingTile({ item }: { item: SavedListing }) {
  const [errored, setErrored] = useState(false);
  const cover = item.listing.photos?.[0];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={`/landlord/listings/${item.encoded}`}
        className="group block rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur overflow-hidden transition hover:border-white/20"
      >
        <div className="aspect-[16/8] bg-slate-800 relative">
          {cover && !errored ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={item.listing.title}
              onError={() => setErrored(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-700">
              <ImageIcon className="size-8" strokeWidth={1.25} />
            </div>
          )}
          {item.applicantCount > 0 && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-white ring-1 ring-white/15">
              <MailOpen className="size-3 text-emerald-300" />
              {item.applicantCount}{" "}
              {item.applicantCount === 1 ? "applicant" : "applicants"}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="font-display text-lg font-medium tracking-tight text-white truncate">
            {item.listing.title}
          </div>
          <div className="mt-1 text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span>
              €{item.listing.rent.toLocaleString("nl-NL")} / month
            </span>
            {item.listing.bedrooms > 0 && (
              <>
                <span>·</span>
                <span>
                  {item.listing.bedrooms} bedroom
                  {item.listing.bedrooms === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
