"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Link2, Plus, Upload, X } from "lucide-react";

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export function ImageUploader({ values, onChange, max = 4 }: Props) {
  const [urlInput, setUrlInput] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotsLeft = Math.max(0, max - values.length);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || slotsLeft === 0) return;
    setBusy(true);
    try {
      const taken = Array.from(files).slice(0, slotsLeft);
      const urls = await Promise.all(taken.map((f) => compressImage(f)));
      onChange([...values, ...urls.filter((u) => u !== null) as string[]]);
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleUrlAdd() {
    const trimmed = urlInput.trim();
    if (!trimmed || slotsLeft === 0) return;
    onChange([...values, trimmed]);
    setUrlInput("");
  }

  function removeAt(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {values.map((src, i) => (
          <Thumb key={i} src={src} onRemove={() => removeAt(i)} index={i} />
        ))}
        {slotsLeft > 0 && (
          <label
            className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              busy
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {busy ? (
              <span className="text-[10px] text-emerald-300">Compressing…</span>
            ) : (
              <>
                <Upload className="size-4 text-slate-400 group-hover:text-emerald-300 transition" />
                <span className="text-[11px] font-medium text-slate-300">
                  Drop or pick
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
                  {slotsLeft} slot{slotsLeft === 1 ? "" : "s"} left
                </span>
              </>
            )}
          </label>
        )}
      </div>

      {slotsLeft > 0 && (
        <div className="mt-3 flex gap-2">
          <div className="flex-1 relative">
            <Link2 className="size-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlAdd();
                }
              }}
              placeholder="or paste an image URL"
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-950/60 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 ring-1 ring-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="size-3" />
            Add
          </button>
        </div>
      )}

      <p className="mt-2 text-[10.5px] text-slate-500">
        Uploaded images are compressed in your browser. URLs are used as-is —
        keep them short to keep the listing link manageable.
      </p>
    </div>
  );
}

function Thumb({
  src,
  onRemove,
  index,
}: {
  src: string;
  onRemove: () => void;
  index: number;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18 }}
      className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10 bg-slate-800"
    >
      {errored ? (
        <div className="h-full w-full flex items-center justify-center text-slate-600">
          <ImageIcon className="size-6" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Photo ${index + 1}`}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-950/80 text-white backdrop-blur ring-1 ring-white/10 hover:bg-rose-500/70 transition"
      >
        <X className="size-3" />
      </button>
    </motion.div>
  );
}

async function compressImage(
  file: File,
  maxDim = 1100,
  quality = 0.7
): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const out = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        resolve(out);
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
