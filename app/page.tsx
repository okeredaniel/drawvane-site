import Hero from "@/components/Hero";
import SampleWorkspace from "@/components/SampleWorkspace";
import ProductStory from "@/components/ProductStory";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return <><main id="main-content" tabIndex={-1}><Hero /><SampleWorkspace /><ProductStory /><Faq /><Contact /></main><Footer /></>;
}
