import { Montserrat } from "next/font/google";

// Single sitewide font — applied globally via RootLayout, and re-mapped
// onto every Tailwind font-* token in globals.css (@theme inline), so
// font-display/font-heading/font-body/font-mono all resolve to this same
// family instead of the four separate typefaces used previously.
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
