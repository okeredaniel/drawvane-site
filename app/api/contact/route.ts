import { handleContact } from "@/lib/contact";
export async function POST(request: Request) {
  return handleContact(request, process.env);
}
