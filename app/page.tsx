import HashScroll from "@/components/HashScroll";
import Hero from "@/components/Hero";
import LaptopSection from "@/components/LaptopSection";
import HowItWorks from "@/components/HowItWorks";
import WholeTeam from "@/components/WholeTeam";
import Features from "@/components/Features";
import Scattered from "@/components/Scattered";
import Share from "@/components/Share";
import Results from "@/components/Results";
import Security from "@/components/Security";
import Customers from "@/components/Customers";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HashScroll />
      <main id="main-content">
        <Hero />
        <LaptopSection />
        <HowItWorks />
        <WholeTeam />
        <Features />
        <Scattered />
        <Share />
        <Results />
        <Security />
        <Customers />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
