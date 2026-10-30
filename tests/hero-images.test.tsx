import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { MobileCards } from "../components/Hero";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
test("every mobile drawing card renders an existing image without source or key errors", () => {
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<MobileCards />);
  const images = Array.from(container.querySelectorAll("img"));
  expect(images).toHaveLength(4);
  for (const image of images) {
    const src = image.getAttribute("src");
    expect(src).toMatch(/^\/illustrations\/.+\.svg$/);
    expect(existsSync(join(process.cwd(), "public", src!))).toBe(true);
  }
  expect(errors).not.toHaveBeenCalled();
});
