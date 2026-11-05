import TeamAlignment from "@/components/sections/TeamAlignment";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Construction intelligence, connected | Stratora" };

export default function TeamAlignmentPage() {
  return (
    <main>
      <TeamAlignment />
      <ContactUs peek={false} />
    </main>
  );
}

