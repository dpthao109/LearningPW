const { chromium } = require('playwright');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

(async () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const baseURL = process.env.URL;
  if (!username || !password || !baseURL) {
    console.error('Please set TEST_USERNAME, TEST_PASSWORD and URL in your environment (or .env file).');
    process.exit(1);
  }

  const storageDir = path.join(process.cwd(), 'env');
  const storagePath = process.env.STORAGE_STATE_PATH || path.join(storageDir, 'storageState.json');
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    console.log(`🔄 Navigating to ${baseURL}...`);
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000); // Give page time to render
    console.log(`✓ Navigated to ${baseURL}`);

    // Step 1: Click "Log in / Sign up" link (same as LoginPage.logIn)
    console.log(`🔄 Looking for "Log in / Sign up" link...`);
    const loginLink = page.getByRole('link', { name: 'Log in / Sign up' });
    await loginLink.waitFor({ state: 'visible', timeout: 10000 });
    await loginLink.click();
    console.log(`✓ Clicked "Log in / Sign up" link`);
    await page.waitForTimeout(500);

    // Step 2: Fill username/email textbox
    console.log(`🔄 Looking for username input...`);
    const usernameInput = page.getByRole('textbox', { name: 'Username or email address' });
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await usernameInput.fill(username);
    console.log(`✓ Filled username: ${username}`);

    // Step 3: Fill password textbox
    console.log(`🔄 Looking for password input...`);
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(password);
    console.log(`✓ Filled password`);

    // Step 4: Click "LOG IN" button
    console.log(`🔄 Looking for "LOG IN" button...`);
    const loginButton = page.getByRole('button', { name: 'LOG IN' });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    console.log(`✓ Clicked "LOG IN" button`);

    // Wait for navigation to complete
    console.log(`🔄 Waiting for page to load...`);
    await page.waitForLoadState('networkidle');
    console.log(`✓ Page loaded`);

    // Save authentication state
    console.log(`🔄 Saving storage state...`);
    await page.context().storageState({ path: storagePath });
    console.log(`✓ Saved storage state to ${storagePath}`);
    console.log(`\n✅ SUCCESS! You can now run: npx playwright test --workers=4`);
  } catch (err) {
    console.error('\n✗ Failed to create storage state:', err.message);
    console.error('Stack:', err.stack);
    
    // Save debug artifacts
    try {
      const screenshotPath = path.join(process.cwd(), 'env', 'saveAuth-failure.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved to ${screenshotPath}`);
    } catch (e) {
      console.error('Could not save screenshot:', e.message);
    }

    try {
      const htmlPath = path.join(process.cwd(), 'env', 'page.html');
      const html = await page.content();
      fs.writeFileSync(htmlPath, html, 'utf-8');
      console.log(`📄 Page HTML saved to ${htmlPath}`);
    } catch (e) {
      console.error('Could not save HTML:', e.message);
    }

    console.log('\n⏸️  Pausing for 5 seconds so you can inspect the browser...');
    await page.waitForTimeout(5000);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
