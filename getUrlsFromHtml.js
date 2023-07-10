const { JSDOM } = require("jsdom");

function getUrlsFromHtml(html, baseUrl, currentUrl) {
  const urls = [];
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll("a");

  if (currentUrl === "https://www.walgreens.com") {
    for (const link of links) {
      if (link.href.includes("Household")) {
        try {
          const urlObject = new URL(`${baseUrl}${link.href}`);
          urls.push(urlObject.href);
        } catch (e) {
          console.log(e);
        }
      }
    }
  } else if (
    currentUrl ===
    "https://www.walgreens.com/store/c/household-and-pet-essentials/ID=20000910-tier1?ban=dl_dl_FeatCategory_Household_Pet_Essentials"
  ) {
    const needs = dom.window.document.querySelector("#shop-by-needs");
    productNeeds = needs.querySelectorAll("a");
    for (const need of productNeeds) {
      try {
        const urlObject = new URL(`${baseUrl}${need.href}`);
        urls.push(urlObject.href);
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    for (const link of links) {
      let productChild = link.querySelectorAll(".product");
      if (link.href.slice(0, 1) === "/" && productChild) {
        try {
          const urlObject = new URL(`${baseUrl}${link.href}`);
          urls.push(urlObject.href);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  return urls;
}

module.exports = {
  getUrlsFromHtml,
};
