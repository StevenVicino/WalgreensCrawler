async function crawlPage(currentUrl) {
  console.log(`${currentUrl}`);

  try {
    const response = await fetch(currentUrl);
    if (response.status >= 400) {
      console.log(`Error: Status ${response.status}`);
      return;
    }
    console.log(await response.text());
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  crawlPage,
};
