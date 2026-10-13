import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Thai } from "next/font/google";

// One engineered family for both scripts: Plex Sans Thai was drawn alongside Plex Sans,
// so Thai and Latin share proportions. Mono is reserved for real data (dates, numbers,
// barcodes), never for decorative labels.

export const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
});
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const fontVariables = `${plexSans.variable} ${plexThai.variable} ${plexMono.variable}`;
