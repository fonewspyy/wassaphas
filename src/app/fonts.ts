import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";

// Shared by every root layout (public site, admin, global 404).
// Geist covers Latin; Noto Sans Thai picks up Thai glyphs through the font stack in globals.css.

export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const notoThai = Noto_Sans_Thai({ variable: "--font-thai", subsets: ["thai"] });

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${notoThai.variable}`;
