const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(
        "https://realgroovy.co.nz/search?q=&hPP=128&idx=main&p=0&dFR%5Bmeta%5D%5B0%5D=On%20Sale&is_v=1"
    );

    findItemsOnPage(minDiscountPercent);

    setInterval(function () {
        driver.quit();
    }, 20000);
};

const findItemsOnPage = async (minDiscountPercent) => {
    const items = await driver.findElements(By.className("display-card"));
    console.log(`Found ${items.length} items on page`);

    for (let i = 0; i < items.length; i++) {
        const infoElement = await items[i].findElement(
            By.className("footer-left")
        );
        const itemName = await infoElement
            .findElement(By.className("text"))
            .getText();

        let artists = "";
        try {
            artistsElement = await infoElement.findElement(
                By.className("subtitle")
            );
            artists = await artistsElement.getText();
        } catch (error) {}

        const priceElement = await infoElement.findElement(
            By.className("title")
        );
        const prevPrice = await priceElement
            .findElement(By.className("was"))
            .getText();
        const newPrice = await priceElement
            .findElement(By.tagName("strong"))
            .getText();

        const oldPrice = parseFloat(prevPrice.replace(/[^0-9.]+/g, ""));
        const price = parseFloat(newPrice.replace(/[^0-9.]+/g, ""));

        const discount = ((oldPrice - price) / oldPrice) * 100;

        if (discount > minDiscountPercent) {
            console.log(`${itemName} ${artists}`);
            console.log(`$${price} - ${discount.toFixed(1)}% OFF`);
            console.log("----------");
        }
    }
};

scrape();
