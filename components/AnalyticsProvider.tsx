"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, pageview, initPlausible } from "@/lib/analytics";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // تهيئة Google Analytics
    const gaId = localStorage.getItem("ga_id");
    if (gaId) {
      initGA();
    }

    // تهيئة Plausible Analytics
    const plausibleDomain = localStorage.getItem("plausible_domain");
    if (plausibleDomain) {
      initPlausible(plausibleDomain);
    }
  }, []);

  useEffect(() => {
    // تتبع مشاهدة الصفحة عند تغيير المسار
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}