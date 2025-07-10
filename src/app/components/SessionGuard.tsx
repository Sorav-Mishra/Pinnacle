"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Store entry time if not already
      const entryTime = localStorage.getItem("entryTime");
      if (!entryTime) {
        localStorage.setItem("entryTime", Date.now().toString());
      }

      // 2. Check for session expiration and re-login
      const interval = setInterval(() => {
        const storedTime = localStorage.getItem("entryTime");
        const now = Date.now();

        // Auto signIn after 2 minutes (120000 ms)
        if (storedTime && !session && now - parseInt(storedTime) > 120000) {
          signIn(); // triggers Google login
        }
      }, 1000);

      // 3. Track total time spent on unload (close/refresh)
      const handleUnload = () => {
        const storedTime = localStorage.getItem("entryTime");
        if (storedTime) {
          const timeSpent = Math.floor(
            (Date.now() - parseInt(storedTime)) / 1000
          ); // in seconds
          navigator.sendBeacon(
            "/api/track-time",
            new Blob([JSON.stringify({ timeSpent })], {
              type: "application/json",
            })
          );
        }
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        clearInterval(interval);
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [session]);

  return <>{children}</>;
}
