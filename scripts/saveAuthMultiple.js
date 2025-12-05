const { chromium } = require('playwright');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

(async () => {
  const baseURL = process.env.URL;
  if (!baseURL) {
    console.error('Please set URL in your environment (or .env file).');
    process.exit(1);
  }

  const accounts = [];
  for (let i = 1; i <= 4; i++) {
    const user = process.env[`TEST_USERNAME_${i}`];
    const pass = process.env[`TEST_PASSWORD_${i}`];
    if (!user || !pass) {
      console.warn(`Skipping account ${i}: TEST_USERNAME_${i} or TEST_PASSWORD_${i} not set.`);
      continue;
    }
    accounts.push({ user, pass, idx: i });
  }

  if (accounts.length === 0) {
    console.error('No accounts found. Set TEST_USERNAME_1..4 and TEST_PASSWORD_1..4 in .env');
    process.exit(1);
  }

  const storageDir = path.join(process.cwd(), 'env');
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  try {
    for (const account of accounts) {
      console.log(`\n🔐 Creating storage for account #${account.idx} (${account.user})`);
      // Create a new, isolated context per account so cookies/localStorage are not shared
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        // Use same login flow as LoginPage
        // Click log in link
        const loginLink = page.getByRole('link', { name: 'Log in / Sign up' });
        await loginLink.waitFor({ state: 'visible', timeout: 10000 });
        await loginLink.click();

        const usernameInput = page.getByRole('textbox', { name: 'Username or email address' });
        await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
        await usernameInput.fill(account.user);

        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await passwordInput.fill(account.pass);

        const loginButton = page.getByRole('button', { name: 'LOG IN' });
        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        // Wait for network idle (adjust if your app uses XHR/WS)
        await page.waitForLoadState('networkidle');

        const dest = path.join(storageDir, `storageState-${account.idx}.json`);
        await context.storageState({ path: dest });
        console.log(`✅ Saved storage state to ${dest}`);
      } catch (err) {
        console.error(`Failed to create storage state for account #${account.idx}:`, err.message);
        try {
          const htmlPath = path.join(storageDir, `page-${account.idx}.html`);
          fs.writeFileSync(htmlPath, await page.content(), 'utf-8');
          console.log(`Saved page HTML to ${htmlPath}`);
        } catch (_) {}
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\nAll done. You should now have env/storageState-1.json .. storageState-<n>.json');
})();
