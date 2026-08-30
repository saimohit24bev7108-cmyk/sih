const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const homeMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
    rootMaxWidth: getComputedStyle(document.getElementById('root')).maxWidth,
  }));

  await page.goto('http://localhost:5173/services/electrical', { waitUntil: 'networkidle' });
  const serviceMobile = await page.evaluate(() => {
    const section = document.querySelector('section');
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      panelLeft: rect.left,
      panelRight: rect.right,
      panelWidth: rect.width,
      panelMarginLeft: Number.parseFloat(getComputedStyle(section).marginLeft || '0'),
      className: section.className,
    };
  });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:5173/services/electrical', { waitUntil: 'networkidle' });
  const serviceDesktop = await page.evaluate(() => {
    const section = document.querySelector('section');
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      panelLeft: rect.left,
      panelRight: rect.right,
      panelWidth: rect.width,
    };
  });

  console.log(JSON.stringify({ homeMetrics, serviceMobile, serviceDesktop }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
