class Product {
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
