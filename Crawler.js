const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { getUrlsFromHtml } = require("./getUrlsFromHtml");
const Product = require("./Product");

class Crawler {
  constructor(baseUrl, startingUrl) {
    this.baseUrl = baseUrl;
    this.startingUrl = startingUrl;
    this.pages = {};
    this.products = [];
    this.visitedUrls = new Set();
  }

  async crawlPage(currentUrl) {
    // Check if the current URL belongs to the same domain
    const baseUrlObj = new URL(this.baseUrl);
    const currentUrlObj = new URL(currentUrl);
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
      return this.pages;
    }

    // Skip if the current URL has already been visited
    if (this.visitedUrls.has(currentUrl)) {
      return this.pages;
    }
    this.visitedUrls.add(currentUrl);

    // Skip if the current URL has already been processed before
    if (this.pages[currentUrl] > 0) {
      this.pages[currentUrl]++;
      return this.pages;
    }

    let browser = null;
    try {
      // Launch a headless browser instance
      browser = await puppeteer.launch({
        headless: "new",
      });
      const page = await browser.newPage();

      // Enable request interception to handle XHR requests
      await page.setRequestInterception(true);
      page.on("request", (interceptedRequest) => {
        if (interceptedRequest.resourceType() === "xhr") {
          interceptedRequest.continue();
        } else {
          interceptedRequest.continue(); // Continue other requests
        }
      });

      // Handle responses to XHR requests
      page.on("response", async (response) => {
        const request = response.request();
        if (request.resourceType() === "xhr" && response.status() <= 300) {
          try {
            const responseBody = await response.json();
            let products = responseBody.products;
            if (responseBody && products) {
              for (const product of products) {
                // Stop crawling if enough products have been collected
                if (this.products.length >= 10) {
                  return this.products;
                }

                // Create a Product object and add it to the list
                const productInfo = new Product(
                  product.productInfo.prodId || null,
                  product.productInfo.productName || null,
                  product.productInfo.priceInfo.regularPrice || null,
                  product.productInfo.productDisplayName || null,
                  product.productInfo.productSize || null,
                  [
                    product.productInfo.imageUrl || null,
                    product.productInfo.imageUrl450 || null,
                    product.productInfo.imageUrl50 || null,
                  ],
                  product.productInfo.upc || null,
                  product.productInfo.productURL || null
                );
                this.products.push(productInfo);
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      });

      // Navigate to the current URL
      await page.goto(currentUrl);
    } catch (e) {
      console.log(e);
    } finally {
      if (browser !== null) {
        await browser.close(); // Close the browser if it was successfully launched
      }
    }

    try {
      // Fetch the HTML content of the current URL
      const response = await fetch(currentUrl);
      if (response.status >= 400) {
        console.log(`Error: Status ${response.status}`);
        return this.pages;
      }
      const htmlBody = await response.text();

      // Extract the URLs from the HTML and continue crawling
      let nextUrls = getUrlsFromHtml(
        htmlBody,
        this.baseUrl,
        currentUrl,
        this.visitedUrls
      );

      for (const nextUrl of nextUrls) {
        // Recursively crawl the next URL
        this.pages = await this.crawlPage(nextUrl);

        // Stop crawling if enough products have been collected
        if (this.products.length >= 10) {
          return this.products;
        }
      }
    } catch (e) {
      console.log(e);
    }

    return this.pages;
  }
}

module.exports = Crawler;
