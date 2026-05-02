"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageSquarePlus, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerifyButton } from "@/components/apply/VerifyButton";
import {
  type LandlordProfile,
  profileIdFromEncoded,
} from "@/lib/landlord-profile";
import { addReviewForLandlord, type Review } from "@/lib/reviews-store";

export function ReviewForm({
  profile,
  profileEncoded,
  onSubmitted,
}: {
  profile: LandlordProfile;
  profileEncoded: string;
  onSubmitted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [stayedFrom, setStayedFrom] = useState("");
  const [stayedTo, setStayedTo] = useState("");
  const [verified, setVerified] = useState(false);

  const canVerify = propertyAddress.trim() !== "";
  const canSubmit =
    verified &&
    firstName.trim() !== "" &&
    lastInitial.trim() !== "" &&
    rating > 0 &&
    text.trim() !== "" &&
    propertyAddress.trim() !== "";

  function reset() {
    setFirstName("");
    setLastInitial("");
    setRating(0);
    setText("");
    setPropertyAddress("");
    setStayedFrom("");
    setStayedTo("");
    setVerified(false);
  }

  function submit() {
    if (!canSubmit) return;
    const review: Review = {
      tenantFirstName: firstName.trim(),
      tenantLastInitial: lastInitial.trim().slice(0, 1).toUpperCase(),
      rating,
      text: text.trim(),
      propertyAddress: propertyAddress.trim(),
      stayedFrom: stayedFrom.trim() || undefined,
      stayedTo: stayedTo.trim() || undefined,
      verifiedStay: true,
      createdAt: new Date().toISOString(),
    };
    addReviewForLandlord(profileIdFromEncoded(profileEncoded), review);
    reset();
    setOpen(false);
    onSubmitted();
  }

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="cta"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <MessageSquarePlus className="size-4" />
            Leave a review
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight text-white">
                    Leave a review
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Only verified stays at {profile.name}&apos;s properties
                    can leave a review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setOpen(false);
                  }}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-300">
                  Which property did you stay at?
                </Label>
                <select
                  value={propertyAddress}
                  onChange={(e) => {
                    setPropertyAddress(e.target.value);
                    setVerified(false);
                  }}
                  className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-950/60 px-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="" className="bg-slate-900">
                    Select an address…
                  </option>
                  {profile.properties.map((p, i) => (
                    <option key={i} value={p.address} className="bg-slate-900">
                      {p.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    Stayed from
                  </Label>
                  <Input
                    value={stayedFrom}
                    onChange={(e) => setStayedFrom(e.target.value)}
                    placeholder="Jun 2022"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    To
                  </Label>
                  <Input
                    value={stayedTo}
                    onChange={(e) => setStayedTo(e.target.value)}
                    placeholder="Mar 2024"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-3">
                <Label className="text-xs font-medium text-emerald-200">
                  Verify that you actually stayed there
                </Label>
                <p className="text-[11px] text-slate-400 mt-1">
                  We confirm with BRP / MijnOverheid that you were registered
                  at this address. Reviews can&apos;t be submitted without
                  verification.
                </p>
                <div className={`mt-3 ${canVerify ? "" : "opacity-50 pointer-events-none"}`}>
                  <VerifyButton
                    source="BRP / MijnOverheid"
                    isVerified={verified}
                    onVerified={() => setVerified(true)}
                    disabled={!canVerify}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-300">
                  Your rating
                </Label>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-0.5"
                    >
                      <Star
                        className={`size-7 transition ${
                          n <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_88px] gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    First name
                  </Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Lotte"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    Initial
                  </Label>
                  <Input
                    value={lastInitial}
                    onChange={(e) =>
                      setLastInitial(
                        e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1)
                      )
                    }
                    maxLength={1}
                    placeholder="V"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500 text-center uppercase"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-300">
                  Your review
                </Label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 800))}
                  rows={4}
                  placeholder="What was your experience? How was the landlord, the building, the responsiveness?"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
                <div className="mt-1 text-right text-[10px] text-slate-500">
                  {text.length}/800
                </div>
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.20)] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
              >
                {verified ? (
                  <>
                    <Check className="size-4" strokeWidth={3} />
                    Submit verified review
                  </>
                ) : (
                  <>Verify your stay first</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
