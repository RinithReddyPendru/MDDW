import { useEffect, useState } from "react";
import { loadProgress, type ProgressState } from "./storage";

export type RegistrationGate =
  | { status: "loading"; progress: null }
  | { status: "unregistered"; progress: ProgressState }
  | { status: "ok"; progress: ProgressState };

/**
 * Reads the ASHA's registration from localStorage on the client only.
 *
 * Progress lives in localStorage, which does not exist during SSR. Reading it
 * straight into render makes the server decide "logged out" while the client
 * decides "logged in" — a hydration mismatch that bounces signed-in ASHAs back
 * to /login. Every guarded route resolves it here instead, so the rule lives in
 * one place and cannot drift between routes.
 */
export function useRegistration(): RegistrationGate {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress === null) return { status: "loading", progress: null };
  if (!progress.userName || !progress.phoneNumber) {
    return { status: "unregistered", progress };
  }
  return { status: "ok", progress };
}
