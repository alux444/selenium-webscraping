const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");

const fs = require("fs");
const logFilePath = "groovyinfo.txt";
const logStream = fs.createWriteStream(logFilePath, { flags: "w" });
writeToLog = function (item) {
    const message = `${item.name} ${
        item.artists == "" ? "" : `- ${item.artists}`
    }\n$${item.price} - ${item.discount.toFixed(1)}% OFF\n--------`;
    logStream.write(message + "\n");
};

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(
        "https://realgroovy.co.nz/search?q=&hPP=128&idx=main&p=0&dFR%5Bmeta%5D%5B0%5D=On%20Sale&is_v=1"
    );

    driver.sleep(1000);

    const scrapedItems = [];
    const minDiscountPercent = 40;
    await findItemsOnPage(minDiscountPercent, driver, scrapedItems);

    let nextPageAvailable = true;
    while (nextPageAvailable) {
        nextPageAvailable = await goToNextPage(
            minDiscountPercent,
            driver,
            scrapedItems
        );
        if (nextPageAvailable) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    await scrapedItems.sort(
        (a, b) => parseFloat(b.discount) - parseFloat(a.discount)
    );
    for (item of scrapedItems) {
        console.log("Writing to log:", item.name);
        writeToLog(item);
    }

    console.log("Scrape Completed.");
    driver.quit();
};

const goToNextPage = async (minDiscountPercent, driver, array) => {
    try {
        const nextPageButton = await driver.findElement(
            By.className("ais-pagination")
        );
        const linkToNextPage = await nextPageButton.findElement(
            By.css(`[aria-label="Next"]`)
        );
        await linkToNextPage.click();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await findItemsOnPage(minDiscountPercent, driver, array);

        return true;
    } catch (error) {
        return false;
    }
};

const findItemsOnPage = async (minDiscountPercent, driver, array) => {
    driver.sleep(2000);
    const items = await driver.findElements(By.className("display-card"));
    console.log(`${items.length} items found.`);

    for (let i = 0; i < items.length; i++) {
        try {
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
                console.log(
                    `${itemName} ${artists === "" ? "" : `- ${artists}`}`
                );
                console.log(`$${price} - ${discount.toFixed(1)}% OFF`);
                console.log("----------");
                array.push({
                    name: itemName,
                    artists: artists,
                    price: price,
                    discount: discount,
                });
            }
        } catch (error) {}
    }
};

scrape();
