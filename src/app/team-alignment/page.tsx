import TeamAlignment from "@/components/sections/TeamAlignment";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Announcing Stratora 1.0 | Stratora" };

export default function TeamAlignmentPage() {
  return (
    <main>
      <TeamAlignment />
      <ContactUs peek={false} />
    </main>
  );
}
