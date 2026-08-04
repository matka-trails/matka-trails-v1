"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname or searchParams change, navigation finished -> hide loader
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links to show top loading bar immediately
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (anchor && anchor.href) {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // If navigating to another internal page (not same page hash/anchor)
        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search)
        ) {
          setLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-900/20 overflow-hidden pointer-events-none">
      <div className="h-full bg-primary animate-pulse w-full transition-all duration-300 origin-left" style={{
        animation: "topBarProgress 1.5s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes topBarProgress {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.7); }
          100% { transform: translateX(100%) scaleX(1); }
        }
      `}</style>
    </div>
  );
}
