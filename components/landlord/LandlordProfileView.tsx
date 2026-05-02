"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  initialsFromName,
  type LandlordProfile,
  type Property,
  profileIdFromEncoded,
  yearsInBusiness,
} from "@/lib/landlord-profile";
import {
  averageRating,
  listReviewsForLandlord,
  type Review,
} from "@/lib/reviews-store";
import { ReviewForm } from "@/components/landlord/ReviewForm";
import { ReviewsList } from "@/components/landlord/ReviewsList";
import { useIsProfileOwner } from "@/lib/use-role";

export function LandlordProfileView({
  profile,
  profileEncoded,
}: {
  profile: LandlordProfile;
  profileEncoded: string;
}) {
  const profileId = profileIdFromEncoded(profileEncoded);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isOwner } = useIsProfileOwner(profileEncoded);

  useEffect(() => {
    setReviews(listReviewsForLandlord(profileId));
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes(profileId)) {
        setReviews(listReviewsForLandlord(profileId));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [profileId]);

  const years = yearsInBusiness(profile);
  const avg = averageRating(reviews);

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 lg:py-14">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur p-7 sm:p-9"
      >
        <div className="flex items-start gap-5">
          <Avatar profile={profile} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-medium flex items-center gap-1.5">
              {profile.identityVerified ? (
                <>
                  <ShieldCheck className="size-3" strokeWidth={2.5} />
                  Identity verified · DigiD
                </>
              ) : (
                <>Landlord</>
              )}
            </div>
            <h1 className="font-display mt-1 text-3xl sm:text-4xl font-medium tracking-tight text-white">
              {profile.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 text-emerald-300" />
                {years > 0
                  ? `${years} year${years === 1 ? "" : "s"} in business`
                  : "New on Rentiff"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4 text-emerald-300" />
                {profile.propertyCount} propert
                {profile.propertyCount === 1 ? "y" : "ies"}
              </span>
              {profile.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-emerald-300" />
                  {profile.city}
                </span>
              )}
              {avg !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <Star
                    className="size-4 fill-amber-400 text-amber-400"
                    strokeWidth={2}
                  />
                  <span className="font-semibold text-white">{avg}</span>
                  <span className="text-slate-400">
                    ({reviews.length} review
                    {reviews.length === 1 ? "" : "s"})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-6 text-sm text-slate-300 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        )}
      </motion.section>

      {profile.properties.length > 0 && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-medium tracking-tight text-white">
              Properties
            </h2>
            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              {profile.properties.length} listed
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profile.properties.map((p, i) => (
              <PropertyCard
                key={i}
                property={p}
                index={i}
                showCreateListing={isOwner}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-medium tracking-tight text-white">
            Reviews
          </h2>
          <ReviewForm
            profile={profile}
            profileEncoded={profileEncoded}
            onSubmitted={() => setReviews(listReviewsForLandlord(profileId))}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Every review is from a tenant whose stay was confirmed via BRP /
          MijnOverheid.
        </p>
        <div className="mt-6">
          <ReviewsList reviews={reviews} />
        </div>
      </section>

      <div className="mt-16 flex justify-center">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-300 transition"
        >
          ← Back to Rentiff
        </Link>
      </div>
    </div>
  );
}

function Avatar({ profile }: { profile: LandlordProfile }) {
  const [errored, setErrored] = useState(false);
  if (profile.profilePhotoUrl && !errored) {
    return (
      <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-slate-800">
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
    <div className="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-emerald-700/40 ring-1 ring-emerald-500/30 text-white">
      <span className="font-display text-2xl font-medium tracking-tight">
        {initialsFromName(profile.name) || "R"}
      </span>
    </div>
  );
}

function PropertyCard({
  property,
  index,
  showCreateListing,
}: {
  property: Property;
  index: number;
  showCreateListing: boolean;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-slate-900/60 backdrop-blur transition ${
        property.ownershipVerified
          ? "border-emerald-500/30"
          : "border-white/10"
      }`}
    >
      <div className="aspect-[16/10] bg-slate-800 relative">
        {property.photoUrl && !errored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.photoUrl}
            alt={property.address}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-700">
            <ImageIcon className="size-9" strokeWidth={1.25} />
          </div>
        )}
        {property.ownershipVerified && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
            <ShieldCheck className="size-3" strokeWidth={2.5} />
            Ownership verified · Kadaster
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm font-medium text-white">{property.address}</div>
        {property.description && (
          <div className="mt-1 text-xs text-slate-400">
            {property.description}
          </div>
        )}
        {showCreateListing && (
          <Link
            href={`/landlord/new?property=${index}`}
            className="group mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/25 hover:ring-emerald-400/50"
          >
            <Plus className="size-3" strokeWidth={2.5} />
            Create listing for this property
            <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
