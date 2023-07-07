const puppeteer = require("puppeteer");

async function clickOnLink(url, keyword) {
  let links, page, browser;
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });

    links = await page.$$("a");
  } catch (e) {
    throw new Error(e);
  }
  let chosenLink;
  for (const link of links) {
    const linkText = await page.evaluate((el) => el.textContent.trim(), link);
    if (keyword && linkText.includes(keyword)) {
      chosenLink = link;
      break;
    }
  }
  console.log(JSON.stringify(chosenLink, null, 2));
  if (chosenLink) {
    try {
      await chosenLink.click();
      await page.waitForNavigation({ waitUntil: "load" });
    } catch (e) {
      throw new Error(e);
    }
  }
  console.log(page);
  return page;
}

module.exports = {
  clickOnLink,
};
