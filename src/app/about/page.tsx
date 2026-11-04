import About from "@/components/sections/About";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "About | Stratora" };

export default function AboutPage() {
  return (
    <main>
      <About />
      <ContactUs peek={false} />
    </main>
  );
}
