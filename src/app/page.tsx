import Header from "@/components/Header";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Hero from "@/components/sections/Hero";
import MarqueeSection from "@/components/sections/MarqueeSection";
import Rupture from "@/components/sections/Rupture";
import SolutionCentral from "@/components/sections/SolutionCentral";
import RoutineCleanup from "@/components/sections/RoutineCleanup";
import CrmProduct from "@/components/sections/CrmProduct";
import Counters from "@/components/sections/Counters";
import HowItWorks from "@/components/sections/HowItWorks";
import ChatDemo from "@/components/sections/ChatDemo";
import Results from "@/components/sections/Results";
import About from "@/components/sections/About";
import GoogleReviews from "@/components/sections/GoogleReviews";
import Positioning from "@/components/sections/Positioning";
import Diagnostic from "@/components/sections/Diagnostic";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MarqueeSection />
        <Rupture />
        <SolutionCentral />
        <RoutineCleanup />
        <CrmProduct />
        <Counters />
        <HowItWorks />
        <ChatDemo />
        <Results />
        <About />
        <GoogleReviews />
        <Positioning />
        <Diagnostic />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
