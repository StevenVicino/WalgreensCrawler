const { crawlPage } = require("./crawlPage");

const url =
  process.argv.length >= 3 ? process.argv[2] : "https://www.walgreens.com";

async function walgreensCrawler(url) {
  if (url.length < 3) {
    console.log("no website");
    process.exit(1);
  }
  console.log("start crawl " + url);

  const pages = await crawlPage(url, url, {}, new Set(), { products: [] });
  for (const page of pages) {
    console.log(page);
  }
}

walgreensCrawler(url);

module.exports = {
  walgreensCrawler,
  url,
};
