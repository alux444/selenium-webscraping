const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    //nz muscle clearance
    await driver.get("https://www.nzmuscle.co.nz/clearance");

    driver.sleep(5000);

    itemElements = await driver.findElements(By.className("product-item-info"));

    console.log(
        `Searching NZ Muscle Clearance - found ${itemElements.length} items`
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

    setInterval(function () {
        driver.quit();
    }, 20000);
};

scrape();
