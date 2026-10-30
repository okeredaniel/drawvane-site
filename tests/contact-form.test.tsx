import { afterEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ContactPageSection from "../components/ContactPageSection";
const state = vi.hoisted(() => ({ topic: "demo" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ topic: state.topic }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  state.topic = "demo";
});
function fill() {
  fireEvent.change(screen.getByLabelText("First name"), {
    target: { value: "Ada" },
  });
  fireEvent.change(screen.getByLabelText("Last name"), {
    target: { value: "Okafor" },
  });
  fireEvent.change(screen.getByLabelText("Work email"), {
    target: { value: "ada@example.test" },
  });
  fireEvent.change(screen.getByLabelText("What would you like to achieve?"), {
    target: { value: "Discuss our drawing review workflow." },
  });
  fireEvent.click(screen.getByRole("checkbox"));
}
test("enquiry intent follows the URL and unavailable delivery is honest", () => {
  const view = render(<ContactPageSection available={false} />);
  expect(
    (screen.getByRole("radio", { name: "Book a demo" }) as HTMLInputElement)
      .checked,
  ).toBe(true);
  expect(
    (screen.getByRole("button", { name: "Send enquiry" }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  expect(screen.getByText(/nothing will be sent/)).toBeTruthy();
  state.topic = "question";
  view.rerender(<ContactPageSection available={false} />);
  expect(
    (screen.getByRole("radio", { name: "Ask a question" }) as HTMLInputElement)
      .checked,
  ).toBe(true);
});
test("failed delivery preserves the enquiry and permits retry", async () => {
  const send = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Delivery unavailable" }),
  });
  vi.stubGlobal("fetch", send);
  render(<ContactPageSection available />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(
      "Delivery unavailable",
    ),
  );
  expect((screen.getByLabelText("First name") as HTMLInputElement).value).toBe(
    "Ada",
  );
  expect(
    (screen.getByRole("button", { name: "Send enquiry" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false);
  expect(JSON.parse(send.mock.calls[0][1].body)).toMatchObject({
    topic: "demo",
    consent: true,
    email: "ada@example.test",
  });
});
test("HTTP success without acceptance is not shown as success", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
  );
  render(<ContactPageSection available />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(
      "could not be confirmed",
    ),
  );
});
test("pending sends cannot duplicate and acceptance is not a booking", async () => {
  let complete!: (value: unknown) => void;
  const send = vi.fn(
    () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  );
  vi.stubGlobal("fetch", send);
  render(<ContactPageSection available />);
  fill();
  const form = screen.getByLabelText("First name").closest("form")!;
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(send).toHaveBeenCalledTimes(1);
  complete({ ok: true, json: async () => ({ accepted: true }) });
  await waitFor(() =>
    expect(screen.getByText(/not yet a booking confirmation/)).toBeTruthy(),
  );
  expect((screen.getByLabelText("First name") as HTMLInputElement).value).toBe(
    "Ada",
  );
  expect(
    (
      screen.getByRole("button", {
        name: "Accepted for delivery",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  fireEvent.change(screen.getByLabelText("First name"), {
    target: { value: "Ada revised" },
  });
  expect(
    (screen.getByRole("button", { name: "Send enquiry" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false);
});
test("clipboard failures do not claim the enquiry was copied", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
  });
  render(<ContactPageSection available={false} />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Copy enquiry" }));
  await waitFor(() =>
    expect(screen.getByText(/Copy is unavailable/)).toBeTruthy(),
  );
  expect(
    screen.queryByText("Enquiry copied. It has not been sent."),
  ).toBeNull();
});

test("ADAPT enquiries preserve their topic through submission", async () => {
  state.topic = "adapt";
  const send = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ accepted: true }) });
  vi.stubGlobal("fetch", send);
  render(<ContactPageSection available />);
  expect(
    (screen.getByRole("radio", { name: "ADAPT pilot" }) as HTMLInputElement)
      .checked,
  ).toBe(true);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
  expect(JSON.parse(send.mock.calls[0][1].body).topic).toBe("adapt");
  await waitFor(() =>
    expect(screen.getByText(/not yet a booking confirmation/)).toBeTruthy(),
  );
});
