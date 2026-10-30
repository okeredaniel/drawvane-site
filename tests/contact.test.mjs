import test from "node:test";
import assert from "node:assert/strict";
import {
  contactReady,
  validateContact,
  handleContact,
} from "../lib/contact.ts";
const env = {
  RESEND_API_KEY: "test-key",
  CONTACT_FROM: "site@example.test",
  CONTACT_TO: "team@example.test",
};
const data = {
  firstName: "Ada",
  lastName: "Okafor",
  email: "ada@example.test",
  company: "Practice",
  message: "Please discuss a pilot.",
  topic: "pilot",
  website: "",
  consent: true,
};
const request = (body = data, origin = "https://site.example") =>
  new Request("https://site.example/api/contact", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const ok = async () => Response.json({ id: "receipt-test" });
test("missing delivery configuration never accepts enquiries", async () => {
  let called = false;
  const r = await handleContact(request(), {}, async () => {
    called = true;
    return ok();
  });
  assert.equal(r.status, 503);
  assert.equal(called, false);
  assert.equal(contactReady(env), true);
  assert.equal(contactReady({ ...env, CONTACT_TO: "not-an-email" }), false);
});
test("rejects cross-origin requests before delivery", async () => {
  let called = false;
  const r = await handleContact(
    request(data, "https://other.example"),
    env,
    async () => {
      called = true;
      return ok();
    },
  );
  assert.equal(r.status, 403);
  assert.equal(called, false);
});
test("validates consent, topic, email, bounds and honeypot", () => {
  assert.equal(validateContact(data)?.firstName, "Ada");
  for (const patch of [
    { consent: false },
    { topic: "invented" },
    { email: "invalid" },
    { firstName: " " },
    { lastName: "A\r\nB" },
    { message: "x".repeat(4001) },
    { website: "bot" },
    { message: "" },
  ])
    assert.equal(validateContact({ ...data, ...patch }), null);
});
test("requires provider success AND a receipt", async () => {
  for (const result of [
    () => new Response("bad", { status: 500 }),
    () => Response.json({}),
    () => Response.json({ id: "" }),
    () => new Response("not-json"),
  ]) {
    const r = await handleContact(request(), env, async () => result());
    assert.equal(r.status, 502);
    assert.notEqual((await r.json()).accepted, true);
  }
});
test("timeouts and provider rate limits return truthful errors", async () => {
  assert.equal(
    (
      await handleContact(request(), env, async () => {
        throw new Error("timeout");
      })
    ).status,
    502,
  );
  assert.equal(
    (
      await handleContact(
        request(),
        env,
        async () => new Response("", { status: 429 }),
      )
    ).status,
    429,
  );
});
test("accepted request is text-only, fixed-recipient and safely retryable", async () => {
  const calls = [];
  const send = async (url, init) => {
    calls.push({ url, init });
    return ok();
  };
  assert.equal((await handleContact(request(), env, send)).status, 202);
  assert.equal((await handleContact(request(), env, send)).status, 202);
  assert.equal(
    calls[0].init.headers["Idempotency-Key"],
    calls[1].init.headers["Idempotency-Key"],
  );
  const payload = JSON.parse(calls[0].init.body);
  assert.deepEqual(payload.to, ["team@example.test"]);
  assert.equal(payload.reply_to, data.email);
  assert.equal(payload.html, undefined);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  await handleContact(
    request({ ...data, message: "Different question" }),
    env,
    send,
  );
  assert.notEqual(
    calls[0].init.headers["Idempotency-Key"],
    calls[2].init.headers["Idempotency-Key"],
  );
});
test("bounds streamed input even without a Content-Length header", async () => {
  assert.equal(
    (
      await handleContact(
        request({ ...data, message: "x".repeat(20000) }),
        env,
        ok,
      )
    ).status,
    413,
  );
});
test("rejects malformed JSON and non-JSON submissions", async () => {
  const r = new Request("https://site.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://site.example",
      "content-type": "application/json",
    },
    body: "{",
  });
  assert.equal((await handleContact(r, env, ok)).status, 400);
  const other = new Request("https://site.example/api/contact", {
    method: "POST",
    headers: { origin: "https://site.example" },
    body: "x",
  });
  assert.equal((await handleContact(other, env, ok)).status, 415);
});

test("ADAPT pilot is a valid delivery topic", async () => {
  const r = await handleContact(request({ ...data, topic: "adapt" }), env, ok);
  assert.equal(r.status, 202);
});
