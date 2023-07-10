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
    const baseUrlObj = new URL(this.baseUrl);
    const currentUrlObj = new URL(currentUrl);

    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
      return this.pages;
    }

    if (this.visitedUrls.has(currentUrl)) {
      return this.pages; // Skip if the current URL has already been visited
    }

    this.visitedUrls.add(currentUrl);

    if (this.pages[currentUrl] > 0) {
      this.pages[currentUrl]++;
      return this.pages;
    }

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: "new",
      });
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (interceptedRequest) => {
        if (interceptedRequest.resourceType() === "xhr") {
          interceptedRequest.continue();
        } else {
          interceptedRequest.continue(); // Continue other requests
        }
      });

      page.on("response", async (response) => {
        const request = response.request();
        if (request.resourceType() === "xhr" && response.status() <= 300) {
          try {
            const responseBody = await response.json();
            let products = responseBody.products;
            if (responseBody && products) {
              for (const product of products) {
                if (this.products.length >= 10) {
                  return this.products;
                }
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

      await page.goto(currentUrl);
    } catch (e) {
      console.log(e);
    } finally {
      if (browser !== null) {
        await browser.close(); // Close the browser if it was successfully launched
      }
    }

    try {
      const response = await fetch(currentUrl);
      if (response.status >= 400) {
        console.log(`Error: Status ${response.status}`);
        return this.pages;
      }
      const contentType = response.headers.get("content-type");
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data && data.products) {
          const productsData = data.products;
        }
      } else if (contentType.includes("text/html")) {
        const htmlBody = await response.text();
        let nextUrls = getUrlsFromHtml(
          htmlBody,
          this.baseUrl,
          currentUrl,
          this.visitedUrls
        );

        for (const nextUrl of nextUrls) {
          this.pages = await this.crawlPage(nextUrl);
          if (this.products.length >= 10) {
            return this.products;
          }
        }
      } else {
        console.log(`Unsupported content type: ${contentType}`);
      }
    } catch (e) {
      console.log(e);
    }

    return this.pages;
  }
}

module.exports = Crawler;
