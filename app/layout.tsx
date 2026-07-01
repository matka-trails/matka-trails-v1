import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const pfReminder = localFont({
  src: "../public/PF Reminder Pro Regular.otf",
  variable: "--font-reminder",
  display: "swap",
});

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
    <html lang="en" className={`${montserrat.variable} ${pfReminder.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111111",
              color: "#ffffff",
              fontFamily: "var(--font-montserrat), sans-serif",
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
