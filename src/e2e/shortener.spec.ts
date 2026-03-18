import { test, expect } from "@playwright/test";

test("/short page renders URL input", async ({ page }) => {
  await page.goto("/short");
  await expect(page.getByPlaceholder("Paste your long URL here")).toBeVisible();
});

test("Shorten button is disabled with empty URL", async ({ page }) => {
  await page.goto("/short");
  await expect(page.getByRole("button", { name: "Shorten" })).toBeDisabled();
});

test("entering URL and clicking Shorten shows result card", async ({ page }) => {
  await page.goto("/short");
  await page.getByPlaceholder("Paste your long URL here").fill("https://example.com");
  await page.getByRole("button", { name: "Shorten" }).click();
  await expect(page.getByText("Your short link")).toBeVisible();
});

test("result card contains a short URL", async ({ page }) => {
  await page.goto("/short");
  await page.getByPlaceholder("Paste your long URL here").fill("https://example.com");
  await page.getByRole("button", { name: "Shorten" }).click();
  await expect(page.getByText(/tools\.arinahub\.com\/go\//)).toBeVisible();
});

test("Copy button shows success toast when clicked", async ({ page }) => {
  await page.goto("/short");
  await page.getByPlaceholder("Paste your long URL here").fill("https://example.com");
  await page.getByRole("button", { name: "Shorten" }).click();
  await page.locator("button").filter({ has: page.locator("svg.lucide-copy") }).first().click();
  await expect(page.getByText("Copied to clipboard")).toBeVisible();
});