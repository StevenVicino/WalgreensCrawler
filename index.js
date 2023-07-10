const Crawler = require("./Crawler");

// Get the URL from command-line arguments or use a default value
const url =
  process.argv.length >= 3 ? process.argv[2] : "https://www.walgreens.com";

/**
 * Performs crawling of the Walgreens website.
 * @param {string} url - The starting URL for the crawler.
 * @returns {Promise<string>} A promise that resolves to the JSON representation of the crawled products.
 */
async function walgreensCrawler(url) {
  // Check if the URL is valid
  if (url.length < 3) {
    console.log("no website");
    process.exit(1);
  }

  console.log("start crawl " + url);

  // Create a new instance of the crawler
  const crawler = new Crawler(url, url);

  // Perform crawling and retrieve the products
  const products = await crawler.crawlPage(url);

  // Convert products to JSON
  const productsJson = JSON.stringify(products);

  // Log the JSON representation of the products
  console.log(productsJson);

  return productsJson;
}

// Execute the crawler function
walgreensCrawler(url);

module.exports = { walgreensCrawler, url };
