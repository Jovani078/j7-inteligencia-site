import { Inter } from "next/font/google";

// Single sitewide font — applied globally via RootLayout, and re-mapped
// onto every Tailwind font-* token in globals.css (@theme inline), so
// font-display/font-heading/font-body/font-mono all resolve to this same
// family.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});