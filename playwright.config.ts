import { defineConfig } from "@playwright/test";

const PORT = 3100;

// Runs against the static demo build (npm run build:demo). Locally it uses the installed Chrome.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.CI ? undefined : "chrome",
    locale: "he-IL",
    timezoneId: "Asia/Jerusalem",
  },
  webServer: {
    command: `npx http-server out -p ${PORT} -s`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
