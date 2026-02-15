const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://biblingo.com');
  const content = await page.content();
  
  fs.writeFileSync('biblingo-public.html', content);
  console.log(' Scraped public page to biblingo-public.html');
  
  await browser.close();
})();
