import CaseStudies from "@/components/sections/CaseStudies";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Construction use cases | Stratora" };

export default function CaseStudiesPage() {
  return (
    <main>
      <CaseStudies />
      <ContactUs peek={false} />
    </main>
  );
}

