import BookDemo from "@/components/sections/BookDemo";
import ContactUs from "@/components/sections/ContactUs";

export const metadata = { title: "Book a demo | Stratora" };

export default function ContactPage() {
  return (
    <main>
      <BookDemo />
      <ContactUs peek={false} />
    </main>
  );
}
