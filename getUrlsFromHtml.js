const { JSDOM } = require("jsdom");

function getUrlsFromHtml(html, baseUrl) {
  const urls = [];
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll("a");
  for (const link of links) {
    if (link.href.slice(0, 1) === "/") {
      try {
        const urlObject = new URL(`${baseUrl}${link.href}`);
        urls.push(urlObject.href);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const urlObject = new URL(link.href);
        urls.push(urlObject.href);
      } catch (e) {
        console.log(e);
      }
    }
  }
  return urls;
}

module.exports = {
  getUrlsFromHtml,
};
