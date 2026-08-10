import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useRegistration } from "@/lib/mddw/useRegistration";

/**
 * Gates a route behind registration.
 *
 * Before this existed only "/" checked for a registered ASHA, so /learn,
 * /plate, /meals, /game and /progress were all reachable by deep link without
 * a name or phone number — and results were submitted with those fields empty.
 */
export function RequireRegistration({ children }: { children: ReactNode }) {
  const { status } = useRegistration();

  // Nothing is known until the client has read storage; render the ground
  // colour rather than a flash of either the page or the login screen.
  if (status === "loading") {
    return <main className="min-h-dvh bg-gradient-premium" aria-busy="true" />;
  }

  if (status === "unregistered") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
