import Header from "@/components/Header";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import ChatDemo from "@/components/sections/ChatDemo";
import CrmProduct from "@/components/sections/CrmProduct";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
import GoogleReviews from "@/components/sections/GoogleReviews";
import About from "@/components/sections/About";
import Diagnostic from "@/components/sections/Diagnostic";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <ChatDemo />
        <CrmProduct />
        <HowItWorks />
        <Results />
        <About />
        <GoogleReviews />
        <Diagnostic />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}