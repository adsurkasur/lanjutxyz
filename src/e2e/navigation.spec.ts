import { test, expect } from "@playwright/test";

test("homepage renders Simple tools, serious results.", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Simple tools, serious results." })).toBeVisible();
});

test("homepage renders two tool cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("QR Code Generator")).toBeVisible();
  await expect(page.getByText("URL Shortener")).toBeVisible();
});

test("clicking QR card navigates to /qr", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /QR Code Generator/i }).click();
  await expect(page).toHaveURL(/\/qr$/);
});

test("clicking Shortener card navigates to /short", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /URL Shortener/i }).click();
  await expect(page).toHaveURL(/\/short$/);
});

test("html element has class dark on load", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("theme toggle button switches between dark and light", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle theme" });
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});