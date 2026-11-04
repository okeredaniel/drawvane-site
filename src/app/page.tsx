import Hero from "@/components/sections/Hero";
import OurImpact from "@/components/sections/OurImpact";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Features from "@/components/sections/Features";
import ProductFeatures from "@/components/sections/ProductFeatures";
import Integration from "@/components/sections/Integration";
import Comparison from "@/components/sections/Comparison";
import CustomerStories from "@/components/sections/CustomerStories";
import Security from "@/components/sections/Security";
import Pricing from "@/components/sections/Pricing";
import ContactUs from "@/components/sections/ContactUs";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurImpact />
      <Problem />
      <Solution />
      <Features />
      <ProductFeatures />
      <Integration />
      <Comparison />
      <CustomerStories />
      <Security />
      <Pricing />
      <ContactUs />
    </main>
  );
}
