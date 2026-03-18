import { test, expect } from "@playwright/test";

test("/qr page renders Single and Bulk tabs", async ({ page }) => {
  await page.goto("/qr");
  await expect(page.getByRole("button", { name: "Single" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bulk" })).toBeVisible();
});

test("typing in text input updates char counter", async ({ page }) => {
  await page.goto("/qr");
  await page.getByPlaceholder("https://example.com").fill("hello");
  await expect(page.getByText("5/1000")).toBeVisible();
});

test("Generate QR button is disabled with empty input", async ({ page }) => {
  await page.goto("/qr");
  await expect(page.getByRole("button", { name: "Generate QR" })).toBeDisabled();
});

test("after typing and clicking Generate, QR image appears", async ({ page }) => {
  await page.goto("/qr");
  await page.getByPlaceholder("https://example.com").fill("https://example.com");
  await page.getByRole("button", { name: "Generate QR" }).click();
  await expect(page.getByAltText("QR Code")).toBeVisible();
});

test("Download button is visible after generation", async ({ page }) => {
  await page.goto("/qr");
  await page.getByPlaceholder("https://example.com").fill("https://example.com");
  await page.getByRole("button", { name: "Generate QR" }).click();
  await expect(page.getByRole("button", { name: /Download PNG/i })).toBeVisible();
});

test("clicking Bulk tab shows CSV dropzone", async ({ page }) => {
  await page.goto("/qr");
  await page.getByRole("button", { name: "Bulk" }).click();
  await expect(page.getByText("Drop CSV file here or click to browse")).toBeVisible();
});

test("Download sample CSV button is clickable", async ({ page }) => {
  await page.goto("/qr");
  await page.getByRole("button", { name: "Bulk" }).click();
  await page.getByRole("button", { name: /Download sample CSV/i }).click();
});