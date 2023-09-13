const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");

const fs = require("fs");

const logFilePath = "consoleLog.txt";

const logStream = fs.createWriteStream(logFilePath, { flags: "w" });

const originalConsoleLog = console.log;
console.log = function (message) {
    originalConsoleLog.apply(console, arguments);
    logStream.write(message + "\n");
};

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    //nz muscle clearance
    await driver.get("https://www.nzmuscle.co.nz/clearance");

    driver.sleep(5000);

    itemElements = await driver.findElements(By.className("product-item-info"));

    console.log(
        `***** Searching NZ Muscle Clearance - found ${itemElements.length} items *****`
    );

    for (let i = 0; i < itemElements.length; i++) {
        const title = await itemElements[i]
            .findElement(By.className("product-item-name"))
            .getText();

        const prices = await itemElements[i].findElements(
            By.xpath(".//span[@class='price']")
        );

        console.log(title);

        for (let j = 0; j < prices.length; j++) {
            const price = await prices[j].getText();
            if (j == 0) {
                console.log(`Price: ${price}`);
            } else {
                console.log(`from ${price}`);
            }
        }
    }

    //sprintfit
    await driver.get(
        "https://www.sprintfit.co.nz/products/clearance?pgNmbr=2&pgSize=25&isScrollChunk=true&chunkNumber=2"
    );

    driver.sleep(5000);

    const products = await driver.findElements(By.className("product"));
    console.log(
        `***** Searching SprintFit Clearance - found ${products.length} items *****`
    );

    for (let i = 0; i < products.length; i++) {
        const title = await products[i]
            .findElement(By.xpath(".//div[@class='name']"))
            .getText();
        const priceString = await products[i]
            .findElement(By.className("price"))
            .getText();
        const prices = await priceString.split(" ");
        console.log(`${title}: ${prices[1]} from ${prices[0]}`);
    }

    //asn
    await driver.get("https://asnonline.co.nz/collections/supplement-specials");
    driver.sleep(5000);

    const asnItems = await driver.findElements(By.className("product-wrap"));

    console.log(
        `***** Searching ASN specials - found ${asnItems.length} items *****`
    );

    for (let i = 0; i < asnItems.length; i++) {
        const title = await asnItems[i]
            .findElement(By.className("product-thumbnail__title"))
            .getText();
        const price = await asnItems[i]
            .findElement(By.className("product-thumbnail__price"))
            .getText();
        const prices = await price.split(" ");

        console.log(`${title}: ${prices[0]} from ${prices[1]}`);
    }

    //xplosive
    await driver.get("https://xplosiv.nz/clearance.html");

    driver.sleep(5000);

    let notFinished = true;
    while (notFinished) {
        try {
            await driver.executeScript(
                "window.scrollTo(0, document.body.scrollHeight);"
            );

            const timeout = 2000;
            const button = await driver.wait(
                until.elementLocated(By.className("amscroll-load-button")),
                timeout
            );

            await button.click();
        } catch (error) {
            notFinished = false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const xplosivItems = await driver.findElements(
        By.className("product-item")
    );

    console.log(
        `***** Searching Xplosiv clearance - found ${xplosivItems.length} items *****`
    );

    for (let i = 0; i < xplosivItems.length; i++) {
        const title = await xplosivItems[i]
            .findElement(By.className("product-item-name"))
            .getText();
        let price = "";

        try {
            const savedElement = await xplosivItems[i].findElement(
                By.className("price")
            );
            price = await savedElement.getText();
        } catch (error) {}

        let saved = ""; // Default value

        try {
            const savedElement = await xplosivItems[i].findElement(
                By.className("priceSavings")
            );
            saved = await savedElement.getText();
            console.log(`${title}: ${price} ${saved}`);
        } catch (error) {
            console.log(`${title}: ${price}`);
        }
    }

    setInterval(function () {
        driver.quit();
    }, 20000);
};

scrape();
