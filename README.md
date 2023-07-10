# Web Crawler for Walgreens.com

This is a web crawler application that navigates through Walgreens.com and collects information about products in the Household Essentials category.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Navigate to the project directory: `cd your-repo`
3. Install the dependencies: `npm install`

## Usage

1. Open the `index.js` file.
2. Modify the `startingUrl` variable to set the starting URL for crawling. By default, it is set to "https://www.walgreens.com". You can also type in a different website on the command line after typing in npm start.
3. Run the application: `npm start`.
4. The crawler will start navigating through the website and collecting product information.
5. The output will be displayed in the console, showing the collected products in JSON format.

## Extensions

The application can be extended to handle the following:

1. Products outside of the Household Essentials category:

   - Modify the `getUrlsFromHtml` function in `getUrlsFromHtml.js` to include additional logic for identifying and extracting URLs of different product categories.
   - Update the `crawlPage` function in `Crawler.js` to process the newly discovered URLs and extract product information from those pages.

2. Domains beyond Walgreens.com:
   - Modify the `Crawler` class in `Crawler.js` to accept a different base URL and starting URL, allowing the crawler to navigate and collect information from other websites.
   - Adjust the logic in `getUrlsFromHtml` function in `getUrlsFromHtml.js` to handle different HTML structures and URL patterns specific to the target domain.

Please note that extending the application to handle different domains may require additional customization and adaptation based on the specific structure and requirements of each website.
