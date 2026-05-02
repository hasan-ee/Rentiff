import { VerificationBadge } from "@/components/VerificationBadge";
import type { ApplicationData } from "@/lib/encoding";

const CREATED = "2025-05-02T10:00:00.000Z";

const FULL: ApplicationData = {
  firstName: "Lotte",
  lastInitial: "V",
  createdAt: CREATED,
  fields: {
    realPerson: { status: "verified", value: true },
    age: { status: "verified", value: 29 },
    nationality: { status: "verified", value: true },
    income: { status: "verified", value: 3850 },
    employmentContract: { status: "verified", value: true },
    noBkrFlags: { status: "verified", value: true },
    employed: { status: "verified", value: true },
    currentAddress: {
      status: "verified",
      value: "Prinsengracht 263, Amsterdam",
    },
    smoking: { status: "verified", value: "Non-smoker" },
    pets: { status: "declared", value: "Cat" },
    languages: { status: "declared", value: "Dutch, English, German" },
    moveInDate: { status: "declared", value: "1 June 2025" },
    reasonForMoving: {
      status: "declared",
      value: "Relocating closer to office",
    },
  },
};

const VERIFIED_ONLY: ApplicationData = {
  firstName: "Sem",
  lastInitial: "B",
  createdAt: CREATED,
  fields: {
    realPerson: { status: "verified", value: true },
    income: { status: "verified", value: 4200 },
    employed: { status: "verified", value: true },
    noBkrFlags: { status: "verified", value: true },
  },
};

const DECLARED_ONLY: ApplicationData = {
  firstName: "Anouk",
  lastInitial: "K",
  createdAt: CREATED,
  fields: {
    languages: { status: "declared", value: "Dutch, French" },
    household: { status: "declared", value: "Single, no roommates" },
    moveInDate: { status: "declared", value: "Flexible from July" },
  },
};

const EMPTY: ApplicationData = {
  firstName: "",
  lastInitial: "",
  createdAt: CREATED,
  fields: {},
};

export default function BadgePreview() {
  const SHARE = "https://rentiff.demo/v/preview";
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-medium tracking-tight mb-1">
          Badge preview
        </h1>
        <p className="text-sm text-slate-500 mb-10">
          Visual sandbox for the VerificationBadge component. Not part of the
          final demo.
        </p>
        <div className="grid gap-12 md:grid-cols-2">
          <Variant title="Full application">
            <VerificationBadge data={FULL} shareUrl={SHARE} />
          </Variant>
          <Variant title="Verified only">
            <VerificationBadge data={VERIFIED_ONLY} shareUrl={SHARE} />
          </Variant>
          <Variant title="Declared only">
            <VerificationBadge data={DECLARED_ONLY} shareUrl={SHARE} />
          </Variant>
          <Variant title="Empty">
            <VerificationBadge data={EMPTY} shareUrl={SHARE} />
          </Variant>
        </div>
      </div>
    </main>
  );
}

function Variant({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>
      {children}
    </div>
  );
}
