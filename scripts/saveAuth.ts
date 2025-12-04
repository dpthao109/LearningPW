import { chromium } from "playwright";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

(async () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const baseURL = process.env.URL;
  if (!username || !password || !baseURL) {
    console.error("Please set TEST_USERNAME, TEST_PASSWORD and URL in your environment (or .env file).");
    process.exit(1);
  }

  const storageDir = path.join(process.cwd(), "env");
  const storagePath = process.env.STORAGE_STATE_PATH || path.join(storageDir, "storageState.json");
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto(baseURL);

    // Adjust selectors according to your app's login page
    // These are examples — replace with the app's selectors if needed.
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for a page that indicates a successful login. Adjust the URL/matcher as necessary.
    await page.waitForLoadState('networkidle');

    await page.context().storageState({ path: storagePath });
    console.log(`Saved storage state to ${storagePath}`);
  } catch (err) {
    console.error("Failed to create storage state:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
