const Crawler = require("./Crawler");

const url =
  process.argv.length >= 3 ? process.argv[2] : "https://www.walgreens.com";

async function walgreensCrawler(url) {
  if (url.length < 3) {
    console.log("no website");
    process.exit(1);
  }

  console.log("start crawl " + url);

  const crawler = new Crawler(url, url);
  const products = await crawler.crawlPage(url);
  console.log(products);
}

walgreensCrawler(url);
