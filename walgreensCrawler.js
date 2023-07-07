const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { crawlPage } = require("./crawlPage");
const { clickOnLink } = require("./clickOnLink");
const { getUrlsFromHtml } = require("./getUrlsFromHtml");

const url =
  process.argv.length >= 3 ? process.argv[2] : "https://www.walgreens.com";

async function walgreensCrawler(url) {
  if (url.length < 3) {
    console.log("no website");
    process.exit(1);
  }
  console.log("start crawl " + url);

  crawlPage(url);
  // let page = clickOnLink(url, "Household");
  // let currentUrl = await page.evaluate(() => window.location.href);
  // console.log(currentUrl);
  // return currentUrl;
}

walgreensCrawler(url);

module.exports = {
  walgreensCrawler,
  url,
};
