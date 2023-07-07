const { walgreensCrawler, url } = require("./walgreensCrawler");
const { getUrlsFromHtml } = require("./getUrlsFromHtml");
const { test, expect } = require("@jest/globals");

// test("walgreensCrawler ", () => {
//   const actual = walgreensCrawler(url);
//   const expected = url;
//   expect(actual).toEqual(expected);
// });

test("getUrlsFromHtml absolute", () => {
  const html = `<html> 
    <body>
    <a href="https://www.walgreens.com">Walgreens</a>
    </body>
    </html>`;
  const actual = getUrlsFromHtml(html, url);
  const expected = ["https://www.walgreens.com/"];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHtml relative", () => {
  const html = `<html> 
    <body>
    <a href="/path/">Walgreens</a>
    </body>
    </html>`;
  const actual = getUrlsFromHtml(html, url);
  const expected = ["https://www.walgreens.com/path/"];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHtml relative and absolute", () => {
  const html = `<html> 
    <body>
    <a href="https://www.walgreens.com">Walgreens</a>
    <a href="/path/">Walgreens</a>
    </body>
    </html>`;
  const actual = getUrlsFromHtml(html, url);
  const expected = [
    "https://www.walgreens.com/",
    "https://www.walgreens.com/path/",
  ];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHtml invalid", () => {
  const html = `<html> 
    <body>
    <a href="Invalid">Invalid Url</a>
    <a href="https://www.walgreens.com">Walgreens</a>
    <a href="/path/">Walgreens</a>
    </body>
    </html>`;
  const actual = getUrlsFromHtml(html, url);
  const expected = [
    "https://www.walgreens.com/",
    "https://www.walgreens.com/path/",
  ];
  expect(actual).toEqual(expected);
});
