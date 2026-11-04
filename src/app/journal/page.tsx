import Journal from "@/components/sections/Journal";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Journal | Stratora" };

export default function JournalPage() {
  return (
    <main>
      <Journal />
      <ContactUs peek={false} />
    </main>
  );
}
