"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Maintain a stable QueryClient instance across client renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,    // 5 minutes — cached data survives page navigation
            gcTime: 10 * 60 * 1000,       // keep unused cache alive for 10 minutes
            refetchOnWindowFocus: false,   // don't re-fetch when user switches tabs
            refetchOnMount: false,         // don't re-fetch if data is still fresh on re-mount
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
