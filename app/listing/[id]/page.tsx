import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Calendar,
  Euro,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { decodeListing } from "@/lib/listing";
import { criterionByKey } from "@/lib/criteria";
import { ListingPreferenceList } from "@/components/listing/ListingPreferenceList";
import {
  decodeProfile,
  findMatchingProperty,
  initialsFromName,
  yearsInBusiness,
} from "@/lib/landlord-profile";
import {
  RoleAwareApplyCTA,
  TenantOnlyHeaderLink,
} from "@/components/listing/RoleAwareApplyCTA";

type PageProps = { params: { id: string } };

export function generateMetadata({ params }: PageProps) {
  const listing = decodeListing(params.id);
  if (!listing) return { title: "Listing not found — Rentiff" };
  return {
    title: `${listing.title} — Rentiff`,
    description: listing.description ?? `${listing.title} on Rentiff.`,
  };
}

export default function ListingPage({ params }: PageProps) {
  const listing = decodeListing(params.id);

  if (!listing) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
            <ShieldAlert className="size-6" strokeWidth={2} />
          </div>
          <h1 className="font-display mt-5 text-2xl font-medium tracking-tight text-white">
            Listing link is invalid
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            The link may be malformed or removed. Ask the landlord for a fresh
            link.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm text-emerald-300 hover:text-emerald-200"
          >
            Back to home →
          </Link>
        </div>
      </main>
    );
  }

  const orderedPrefs = Object.entries(listing.preferences)
    .map(([key, p]) => ({ criterion: criterionByKey(key), preference: p }))
    .filter((x) => x.criterion !== undefined)
    .sort((a, b) => {
      const order = { required: 0, preferred: 1, optional: 2 } as const;
      return order[a.preference] - order[b.preference];
    });

  const landlordProfile = listing.landlordProfileRef
    ? decodeProfile(listing.landlordProfileRef)
    : null;

  const matchingProperty = landlordProfile
    ? findMatchingProperty(landlordProfile, listing.address)
    : undefined;
  const ownershipVerified =
    !!landlordProfile?.identityVerified &&
    matchingProperty?.ownershipVerified === true;

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[400px] bg-[radial-gradient(40%_50%_at_50%_-10%,rgb(16_185_129_/_0.10)_0%,transparent_70%)]"
      />
      <div aria-hidden className="grid-dots pointer-events-none fixed inset-0 -z-0" />

      <header className="relative z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </span>
            <span className="font-display font-medium tracking-tight text-white">
              Rentiff
            </span>
          </Link>
          <TenantOnlyHeaderLink href="/apply">
            Generic application →
          </TenantOnlyHeaderLink>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 lg:py-14">
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
          Listing on Rentiff
        </div>
        <h1 className="font-display mt-1 text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {listing.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <Euro className="size-4 text-emerald-300" />
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

        {listing.photos && listing.photos.length > 0 && (
          <div className="mt-6 grid gap-2 grid-cols-2 sm:grid-cols-3">
            {listing.photos.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10 bg-slate-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${listing.title} – photo ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {listing.description && (
          <p className="mt-6 text-slate-300 leading-relaxed max-w-2xl">
            {listing.description}
          </p>
        )}

        {landlordProfile && listing.landlordProfileRef && (
          <Link
            href={`/landlord/profile/${listing.landlordProfileRef}`}
            className="mt-8 group flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-4 transition hover:border-white/20"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/30 to-emerald-700/40 ring-1 ring-emerald-500/30 text-white">
              {landlordProfile.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={landlordProfile.profilePhotoUrl}
                  alt={landlordProfile.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <span className="font-display text-base font-medium">
                  {initialsFromName(landlordProfile.name) || "R"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80 font-medium flex items-center gap-1">
                <User className="size-3" />
                Listed by
              </div>
              <div className="font-medium text-white truncate flex items-center gap-1.5">
                {landlordProfile.name}
                {landlordProfile.identityVerified && (
                  <ShieldCheck
                    className="size-3.5 text-emerald-400 shrink-0"
                    strokeWidth={2.5}
                  />
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {yearsInBusiness(landlordProfile)} yr in business
                </span>
                <span>·</span>
                <span>{landlordProfile.propertyCount} properties</span>
                {ownershipVerified && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <ShieldCheck className="size-3" strokeWidth={2.5} />
                      Owns this property · Kadaster
                    </span>
                  </>
                )}
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-500 group-hover:text-white transition" />
          </Link>
        )}

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                What this landlord cares about
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Required items must be verified. Preferred items improve your
                chances. Optional items are nice-to-have.
              </p>
            </div>
          </div>

          <ListingPreferenceList items={orderedPrefs} />
        </section>

        <div className="mt-10">
          <RoleAwareApplyCTA listingId={params.id} />
        </div>
      </div>
    </main>
  );
}
