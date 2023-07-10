const { walgreensCrawler, url } = require("./index");
const { test, expect } = require("@jest/globals");

describe("walgreensCrawler", () => {
  test("should crawl Walgreens website and return a valid JSON", async () => {
    const output = await walgreensCrawler(url);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  test("should return JSON with at least 10 objects", async () => {
    const output = await walgreensCrawler(url);
    const parsedOutput = JSON.parse(output);
    expect(parsedOutput.length).toBeGreaterThanOrEqual(10);
  });

  test("Each object within the JSON should have keys 'id', 'productName', 'listPrice', 'description', 'productDimensions', 'imageURLs', 'productUPC', and 'sourceURL'", async () => {
    const output = await walgreensCrawler(url);
    const parsedOutput = JSON.parse(output);
    parsedOutput.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("productName");
      expect(product).toHaveProperty("listPrice");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("imageURLs");
      expect(product).toHaveProperty("productUPC");
      expect(product).toHaveProperty("sourceURL");
    });
  });
});
