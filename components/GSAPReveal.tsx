"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function GSAPReveal({
  children,
  direction = "up",
  delay = 0
}: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const vars: gsap.TweenVars = {
      opacity: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    };

    if (direction === "up") vars.y = 50;
    if (direction === "down") vars.y = -50;
    if (direction === "left") vars.x = 50;
    if (direction === "right") vars.x = -50;

    gsap.from(element, vars);
  }, [direction, delay]);

  return <div ref={ref}>{children}</div>;
}
