/**
 * Represents a product with various attributes.
 */
class Product {
  /**
   * Creates a new instance of the Product class.
   * @param {string|null} id - The unique identifier of the product.
   * @param {string|null} productName - The name of the product.
   * @param {number|null} listPrice - The list price of the product.
   * @param {string|null} description - The description of the product.
   * @param {string|null} productDimensions - The dimensions of the product.
   * @param {string[]} imageURLs - The URLs of the product's images.
   * @param {string|null} productUPC - The UPC (Universal Product Code) of the product.
   * @param {string|null} sourceURL - The URL of the source page for the product.
   */
  constructor(
    id,
    productName,
    listPrice,
    description,
    productDimensions,
    imageURLs,
    productUPC,
    sourceURL
  ) {
    this.id = id;
    this.productName = productName;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageURLs = imageURLs;
    this.productUPC = productUPC;
    this.sourceURL = sourceURL;
  }
}

module.exports = Product;
