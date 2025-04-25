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
      const entryTime = localStorage.getItem("entryTime");

      if (!entryTime) {
        localStorage.setItem("entryTime", Date.now().toString());
      }

      const interval = setInterval(() => {
        const storedTime = localStorage.getItem("entryTime");
        const now = Date.now();

        if (storedTime && !session && now - parseInt(storedTime) > 60000) {
          signIn(); // Will open Google login
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  return <>{children}</>;
}
