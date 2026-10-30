import { createHash } from "node:crypto";

export const TOPICS = ["pilot", "demo", "question", "adapt"] as const;
export type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
  topic: (typeof TOPICS)[number];
};
type Config = {
  [key: string]: string | undefined;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
};
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export function contactReady(env: Config): boolean {
  return Boolean(
    env.RESEND_API_KEY &&
    env.CONTACT_FROM &&
    env.CONTACT_TO &&
    emailPattern.test(env.CONTACT_FROM) &&
    emailPattern.test(env.CONTACT_TO),
  );
}
export function validateContact(input: unknown): ContactData | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const [key, max] of Object.entries({
    firstName: 80,
    lastName: 80,
    email: 254,
    company: 120,
    message: 4000,
    topic: 20,
  })) {
    if (typeof v[key] !== "string" || v[key].length > max) return null;
    result[key] = v[key].trim();
  }
  if (
    !result.firstName ||
    !result.lastName ||
    !result.message ||
    !emailPattern.test(result.email) ||
    !TOPICS.includes(result.topic as ContactData["topic"])
  )
    return null;
  if (
    /[\r\n]/.test(
      result.firstName + result.lastName + result.email + result.company,
    )
  )
    return null;
  if (v.website !== "" || v.consent !== true) return null;
  return result as ContactData;
}
const response = (status: number, body: object) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handleContact(
  request: Request,
  env: Config,
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return response(403, {
      error: "Please send your enquiry from this website.",
    });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return response(415, { error: "This request could not be read." });
  if (!contactReady(env))
    return response(503, {
      error:
        "Online enquiries are temporarily unavailable. Your details have not been sent.",
    });
  let data: ContactData | null;
  try {
    // Bound the stream itself, not just the optional Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return response(400, { error: "Please complete the form." });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return response(413, { error: "Please shorten your enquiry." });
      }
      chunks.push(part.value);
    }
    data = validateContact(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return response(400, { error: "Please check your details and try again." });
  }
  if (!data)
    return response(400, {
      error: "Please check your details and consent before sending.",
    });
  try {
    const body = {
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: data.email,
      subject: `Stratora website: ${data.topic}`,
      text: `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nCompany: ${data.company || "Not provided"}\nTopic: ${data.topic}\n\n${data.message}`,
    };
    // Identical retries share a provider key, even across server instances (24-hour provider window).
    const key = createHash("sha256").update(JSON.stringify(body)).digest("hex");
    const upstream = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `stratora-enquiry/${key}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok)
      return response(upstream.status === 429 ? 429 : 502, {
        error:
          "Your enquiry could not be confirmed. Your details are still here; please try again shortly.",
      });
    const receipt = await upstream.json();
    if (typeof receipt.id !== "string" || !receipt.id.trim())
      throw new Error("Missing receipt");
    // Acceptance by the delivery service is not proof of inbox delivery or a team reply.
    return response(202, { accepted: true });
  } catch {
    return response(502, {
      error:
        "Your enquiry could not be confirmed. Your details are still here; please try again shortly.",
    });
  }
}
