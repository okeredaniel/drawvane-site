import HashScroll from "@/components/HashScroll";
import Hero from "@/components/Hero";
import LaptopSection from "@/components/LaptopSection";
import LogoStrip from "@/components/LogoStrip";
import HowItWorks from "@/components/HowItWorks";
import WholeTeam from "@/components/WholeTeam";
import Features from "@/components/Features";
import Scattered from "@/components/Scattered";
import Share from "@/components/Share";
import Results from "@/components/Results";
import Security from "@/components/Security";
import Customers from "@/components/Customers";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingPills from "@/components/FloatingPills";

export default function Home() {
  return (
    <>
      <HashScroll />
      <main>
        <Hero />
        <LaptopSection />
        <FloatingPills />
        <HowItWorks />
        <WholeTeam />
        <Features />
        <Scattered />
        <Share />
        <Results />
        <Security />
        <Customers />
        <Faq />
        <Footer />
      </main>
    </>
  );
}