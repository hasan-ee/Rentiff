"use client";

import { useEffect, useState } from "react";
import { LANDLORD_PROFILE_LOCAL_KEY } from "@/lib/landlord-profile";

export type UserRole = "landlord" | "tenant";

export function useUserRole(): { role: UserRole; hydrated: boolean } {
  const [role, setRole] = useState<UserRole>("tenant");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANDLORD_PROFILE_LOCAL_KEY);
      if (stored && stored.length > 0) setRole("landlord");
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }

    function onStorage(e: StorageEvent) {
      if (e.key === LANDLORD_PROFILE_LOCAL_KEY) {
        try {
          const v = window.localStorage.getItem(LANDLORD_PROFILE_LOCAL_KEY);
          setRole(v ? "landlord" : "tenant");
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { role, hydrated };
}

export function useIsProfileOwner(profileEncoded: string): {
  isOwner: boolean;
  hydrated: boolean;
} {
  const [isOwner, setIsOwner] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANDLORD_PROFILE_LOCAL_KEY);
      setIsOwner(stored === profileEncoded);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, [profileEncoded]);

  return { isOwner, hydrated };
}
