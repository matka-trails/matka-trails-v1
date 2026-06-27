"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register GSAP ScrollTrigger on the client
    gsap.registerPlugin(ScrollTrigger);

    const lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Update ScrollTrigger when lenis scroll event fires
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Coordinate GSAP ticker with Lenis frame requests
    const tickHandler = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(tickHandler);
    };
  }, []);

  return <>{children}</>;
}
