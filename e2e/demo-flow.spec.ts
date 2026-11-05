import { expect, test } from "@playwright/test";

// The whole app, in demo mode, the way people use it.

test("the marketing site opens and links to the demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /נסו את הדמו/ }).click();
  await expect(page).toHaveURL(/\/login\/$/);
});

test("the personal area sends signed-out visitors to the login page", async ({ page }) => {
  await page.goto("/app/admin/");
  await expect(page).toHaveURL(/\/login\/$/);
});

test("staff log a meal and the group sees it in the log", async ({ page }) => {
  await page.goto("/login/");
  await page.getByRole("button", { name: /מירב, מטפלת/ }).click();
  await expect(page).toHaveURL(/\/app\/staff\/$/);

  await page.goto("/app/staff/log/");
  await page.getByRole("button", { name: "כל הקבוצה" }).click();
  await page.getByRole("button", { name: /שמירת עדכון/ }).click();
  await expect(page.getByRole("status")).toContainText("נשמר");
});

test("a pickup code is rejected when wrong and accepted when right", async ({ page }) => {
  await page.goto("/login/");
  await page.getByRole("button", { name: /מירב, מטפלת/ }).click();
  await expect(page).toHaveURL(/\/app\/staff\/$/);
  await page.goto("/app/staff/pickup/");

  await page.getByLabel(/הקוד שההורה מציג/).fill("123");
  await page.getByRole("button", { name: "אימות" }).click();
  await expect(page.getByRole("status")).toContainText("לא תקין");

  await page.getByRole("button", { name: /הקוד של/ }).click();
  await page.getByRole("button", { name: "אימות" }).click();
  await page.getByRole("button", { name: "רישום יציאה" }).click();
  await expect(page.getByRole("status")).toContainText("נאסף/ה");
});

test("a parent reports an absence", async ({ page }) => {
  await page.goto("/login/");
  await page.getByRole("button", { name: /דנה, אמא של נועה/ }).click();
  await expect(page).toHaveURL(/\/app\/parent\/$/);
  await page.goto("/app/parent/messages/");

  await page.getByRole("button", { name: "דיווח היעדרות להיום" }).click();
  await expect(page.getByRole("status")).toContainText("לא בגן היום");
});

test("the director records a payment", async ({ page }) => {
  await page.goto("/login/");
  await page.getByRole("button", { name: /אורית, מנהלת/ }).click();
  await expect(page).toHaveURL(/\/app\/admin\/$/);
  await page.goto("/app/admin/finance/");

  const buttons = page.getByRole("button", { name: "רישום תשלום" });
  const before = await buttons.count();
  await buttons.first().click();
  await expect(buttons).toHaveCount(before - 1);
});

test("each role only sees its own area", async ({ page }) => {
  await page.goto("/login/");
  await page.getByRole("button", { name: /דנה, אמא של נועה/ }).click();
  await expect(page).toHaveURL(/\/app\/parent\/$/);
  await page.goto("/app/admin/finance/");
  await expect(page).toHaveURL(/\/app\/parent\/$/);
});
