import CaseStudies from "@/components/sections/CaseStudies";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Case Studies | Stratora" };

export default function CaseStudiesPage() {
  return (
    <main>
      <CaseStudies />
      <ContactUs peek={false} />
    </main>
  );
}
