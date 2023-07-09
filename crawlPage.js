const { getUrlsFromHtml } = require("./getUrlsFromHtml");
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");

async function crawlPage(
  baseUrl,
  currentUrl,
  pages,
  visitedUrls,
  productsJSON
) {
  console.log(`${currentUrl}`);
  console.log(productsJSON);

  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(currentUrl);

  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }

  if (visitedUrls.has(currentUrl)) {
    return pages; // Skip if the current URL has already been visited
  }

  visitedUrls.add(currentUrl);

  if (pages[currentUrl] > 0) {
    pages[currentUrl]++;
    return pages;
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
              productsJSON.products.push({
                id: product.productInfo.prodId
                  ? product.productInfo.prodId
                  : null,
                productName: product.productInfo.productName
                  ? product.productInfo.productName
                  : null,
                listPrice: product.productInfo.priceInfo.regularPrice
                  ? product.productInfo.priceInfo.regularPrice
                  : null,
                description: product.productInfo.productDisplayName
                  ? product.productInfo.productDisplayName
                  : null,
                productDimensions: product.productInfo.productSize
                  ? product.productInfo.productSize
                  : null,
                imageURLs: [
                  product.productInfo.imageUrl
                    ? product.productInfo.imageUrl
                    : null,
                  product.productInfo.imageUrl450
                    ? product.productInfo.imageUrl450
                    : null,
                  product.productInfo.imageUrl50
                    ? product.productInfo.imageUrl50
                    : null,
                ],
                productUPC: product.productInfo.upc
                  ? product.productInfo.upc
                  : null,
                sourceURL: product.productInfo.productURL
                  ? product.productInfo.productURL
                  : null,
              });
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
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (data && data.products) {
        const productsData = data.products;
        console.log("Products:", productsData);
      }
    } else if (contentType.includes("text/html")) {
      const htmlBody = await response.text();
      let nextUrls = getUrlsFromHtml(
        htmlBody,
        baseUrl,
        currentUrl,
        visitedUrls
      );

      for (const nextUrl of nextUrls) {
        pages = await crawlPage(
          baseUrl,
          nextUrl,
          pages,
          visitedUrls,
          productsJSON
        );
        if (productsJSON.products.length > 20) {
          console.log(productsJSON.products);
          return productsJSON;
        }
      }
    } else {
      console.log(`Unsupported content type: ${contentType}`);
    }
  } catch (e) {
    console.log(e);
  }
  return pages;
}

module.exports = {
  crawlPage,
};
