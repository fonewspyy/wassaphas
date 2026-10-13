"use client";

// Single place that registers GSAP plugins, so every motion component imports from here
// and registration happens once, before any useGSAP call.
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Animations only run when the visitor hasn't asked the OS to reduce motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
