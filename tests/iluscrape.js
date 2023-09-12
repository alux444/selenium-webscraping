const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://www.iloveugly.co.nz/collections/sale-section");

    const items = {
        titles: [],
        prices: [],
        discounts: [],
    };

    const titles = await driver.findElements(
        By.className("ProductItem__Title")
    );
    const prices = await driver.findElements(By.className("Price--highlight"));
    const before = await driver.findElements(By.className("Price--compareAt"));

    for (let i = 0; i < titles.length; i++) {
        const title = await titles[i].getText();
        items.titles.push(title);
        const price = await prices[i].getText();
        items.prices.push(price);
        const discount = await before[i].getText();
        items.discounts.push(discount);
    }

    for (let i = 0; i < items.titles.length; i++) {
        console.log(
            items.titles[i] +
                " " +
                items.prices[i] +
                " from " +
                items.discounts[i]
        );
    }

    setInterval(function () {
        driver.quit();
    }, 20000);
};

scrape();
