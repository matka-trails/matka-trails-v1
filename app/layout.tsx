import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matka Trails — Weekend Group Travel & Trekking",
  description: "Explore winding trails, meet your group, and travel solo in a curated small group experience led by expert captains.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111111",
              color: "#ffffff",
              fontFamily: "var(--font-main)",
              borderRadius: "var(--radius-md)",
            },
            success: {
              iconTheme: {
                primary: "#ff6600",
                secondary: "#ffffff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
