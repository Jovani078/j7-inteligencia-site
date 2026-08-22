import { Montserrat } from "next/font/google";

// Shared Montserrat instance — loaded once, reused wherever it's needed
// (Preloader counter, Hero first-fold copy) instead of re-importing.
// Not applied globally: consumers opt in locally via `montserrat.variable`.
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});
