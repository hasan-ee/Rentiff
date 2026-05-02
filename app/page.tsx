"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Handshake,
  ListChecks,
  Send,
  ShieldCheck,
} from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { ApplicationData } from "@/lib/encoding";
import { useUserRole } from "@/lib/use-role";

const SAMPLE: ApplicationData = {
  firstName: "Lotte",
  lastInitial: "V",
  createdAt: new Date().toISOString(),
  fields: {
    realPerson: { status: "verified", value: true },
    income: { status: "verified", value: 3850 },
    employed: { status: "verified", value: true },
    noBkrFlags: { status: "verified", value: true },
    pets: { status: "declared", value: "Cat" },
    languages: { status: "declared", value: "Dutch, English" },
  },
};

const SOURCES = ["DigiD", "Tink", "UWV", "KvK", "BKR", "BRP", "DUO"];

export default function HomePage() {
  const { role, hydrated } = useUserRole();
  const isLandlord = hydrated && role === "landlord";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <BackgroundDecor />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <ShieldCheck className="size-4" strokeWidth={2.25} />
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-white">
            Rentiff
          </span>
        </Link>
        <Link
          href="/apply"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/15"
        >
          Create application
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-14 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              The trust layer for Dutch rentals
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display mt-5 text-5xl sm:text-6xl lg:text-[68px] font-medium tracking-tight text-white leading-[0.98]"
            >
              Trust, on both
              <br />
              sides of the{" "}
              <span className="italic text-emerald-300">door</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              Tenants represent themselves with verified facts, not paperwork.
              Landlords skip the chasing — every application arrives complete
              and ready to evaluate in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              {isLandlord ? (
                <Link
                  href="/landlord"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-base font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)]"
                >
                  Go to your hub
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/apply"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-base font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)]"
                  >
                    I&apos;m a tenant
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/landlord"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/15"
                  >
                    I&apos;m a landlord
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </Link>
                </>
              )}
            </motion.div>
            <p className="mt-3 text-xs text-slate-400">
              {isLandlord
                ? "Welcome back."
                : "No account. No credit card. Just a link."}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-12"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                Verified with
              </p>
              <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-300">
                {SOURCES.map((s) => (
                  <li key={s} className="text-sm font-semibold tracking-tight">
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotateY: -22 }}
            animate={{ opacity: 1, y: 0, rotateY: -10 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="[perspective:1400px]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transform: "rotateY(-10deg) rotateX(7deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <VerificationBadge data={SAMPLE} showQR={false} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
              For tenants
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-white">
              Represent yourself with{" "}
              <span className="italic text-emerald-300">verified facts</span>,
              not a stack of payslips.
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Decide what to share. Verify what you can. Send one link to as
              many landlords as you need — without re-uploading documents to
              every listing.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
              <Bullet>You choose what each landlord sees</Bullet>
              <Bullet>Verifications are visible and sourced</Bullet>
              <Bullet>One link works everywhere</Bullet>
            </ul>
            {!isLandlord && (
              <Link
                href="/apply"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200 transition"
              >
                Create your application →
              </Link>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
              For landlords
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-white">
              Complete applications,{" "}
              <span className="italic text-emerald-300">ready to evaluate</span>{" "}
              in minutes.
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Build a listing template with exactly the criteria you care
              about. Tenants apply through it knowing what&apos;s required and
              what&apos;s preferred — every application arrives in the same
              shape.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
              <Bullet>Same shape across every applicant</Bullet>
              <Bullet>Verified facts, plainly labelled</Bullet>
              <Bullet>Filtering only on legally permissible criteria</Bullet>
            </ul>
            <Link
              href="/landlord/new"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200 transition"
            >
              Create a listing →
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
            How it works
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Three steps. Then you&apos;re done.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Step
            n={1}
            icon={<ListChecks className="size-5" />}
            title="Pick what to share"
            body="Toggle on only the criteria a landlord actually needs. Lifestyle questions like gender stay off-limits."
          />
          <Step
            n={2}
            icon={<ShieldCheck className="size-5" />}
            title="Verify with Dutch services"
            body="One tap to confirm income with Tink, identity with DigiD, employment with UWV. No file uploads."
          />
          <Step
            n={3}
            icon={<Send className="size-5" />}
            title="Send a single link"
            body="Share a tamper-proof badge URL. Or print the QR. No more emailing payslips to strangers."
          />
        </div>

        <div className="mt-16 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 px-8 py-12 sm:px-12 sm:py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(16_185_129_/_0.18)_0%,transparent_70%)]"
          />
          <div className="relative">
            <Handshake className="mx-auto size-9 text-emerald-300" strokeWidth={1.5} />
            <h3 className="font-display mt-5 text-3xl sm:text-4xl font-medium tracking-tight text-white">
              Trust, transparent on{" "}
              <span className="italic text-emerald-300">both sides</span>.
            </h3>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto">
              Every claim is labelled — verified or self-declared, with the
              source of verification in plain sight. No black-box scoring. No
              hidden filters.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs">
              <Tag>Verified information is sourced and labelled</Tag>
              <Tag>Self-declared items are clearly marked</Tag>
              <Tag>Filtering by gender or age is disallowed</Tag>
            </div>
            <Link
              href={isLandlord ? "/landlord" : "/apply"}
              className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
            >
              {isLandlord ? "Go to your hub" : "Try it now"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>Rentiff is a hackathon project.</p>
        <p className="mt-1">Not affiliated with any government service.</p>
      </footer>
    </main>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: n * 0.08 }}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-7 backdrop-blur transition hover:border-white/20 hover:bg-slate-900/80"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
          {icon}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Step {n}
        </span>
      </div>
      <h3 className="font-display mt-5 text-xl font-medium tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{body}</p>
    </motion.div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check
        className="size-4 mt-0.5 shrink-0 text-emerald-400"
        strokeWidth={3}
      />
      <span>{children}</span>
    </li>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10 text-slate-200 backdrop-blur">
      <Check className="size-3 text-emerald-400" strokeWidth={3} />
      {children}
    </span>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[760px] bg-[radial-gradient(60%_40%_at_50%_-10%,rgb(16_185_129_/_0.18)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[400px] -z-0 h-[600px] bg-[radial-gradient(40%_30%_at_80%_50%,rgb(56_189_248_/_0.10)_0%,transparent_70%)]"
      />
      <div aria-hidden className="grid-dots pointer-events-none absolute inset-0 -z-0" />
    </>
  );
}
