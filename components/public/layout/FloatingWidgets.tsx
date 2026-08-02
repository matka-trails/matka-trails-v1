"use client";

import { useEffect } from "react";

const WHATSAPP_NUMBER = "918294709846";
const WHATSAPP_MESSAGE = "Hi! I'm interested in your travel packages. Can you help me?";

export default function FloatingWidgets() {
  // Inject Tawk.to script on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Avoid duplicate injection
    if (document.getElementById("tawk-script")) return;

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6a6f9017bd7a651d439c84fb/1jv1slnuo";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0?.parentNode?.insertBefore(s1, s0);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      {/* WhatsApp Floating Button — bottom-left */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-float"
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.357.627 4.663 1.817 6.685L2.667 29.333l6.814-1.787A13.28 13.28 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 2.4c5.946 0 10.797 4.85 10.797 10.933s-4.851 10.933-10.797 10.933a10.73 10.73 0 0 1-5.455-1.488l-.39-.234-4.045 1.06 1.08-3.941-.256-.405A10.69 10.69 0 0 1 5.204 16c0-6.083 4.851-10.933 10.799-10.933zm-3.244 5.946c-.197 0-.517.074-.787.37-.27.296-1.032 1.008-1.032 2.458 0 1.45 1.057 2.851 1.204 3.048.148.197 2.063 3.148 5.009 4.293 2.434.96 2.947.77 3.476.722.53-.048 1.711-.7 1.952-1.376.24-.676.24-1.255.168-1.376-.072-.12-.268-.192-.563-.336-.295-.144-1.744-.86-2.015-.958-.27-.097-.467-.144-.663.144-.196.288-.76.958-.931 1.155-.17.197-.34.22-.634.073-.295-.144-1.245-.459-2.372-1.462-.876-.78-1.468-1.743-1.64-2.038-.17-.295-.017-.455.128-.601.13-.13.295-.336.443-.504.148-.168.197-.288.296-.48.098-.196.049-.37-.025-.516-.073-.146-.655-1.6-.904-2.19-.236-.57-.477-.494-.657-.503l-.56-.01z" />
        </svg>

        {/* Pulse ring */}
        <span className="whatsapp-pulse" aria-hidden="true" />
      </a>

      <style jsx global>{`
        /* ── WhatsApp Floating Button ── */
        .whatsapp-float {
          position: fixed;
          bottom: 28px;
          left: 24px;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.25s ease;
          text-decoration: none;
        }

        .whatsapp-float:hover {
          transform: scale(1.12);
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.65);
        }

        .whatsapp-float:active {
          transform: scale(0.96);
        }

        /* Pulse ring animation */
        .whatsapp-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid #25d366;
          animation: wa-pulse 2.4s ease-out infinite;
          pointer-events: none;
        }

        @keyframes wa-pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.55);
            opacity: 0;
          }
          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
