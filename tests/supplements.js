const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    //nz muscle clearance
    await driver.get("https://www.nzmuscle.co.nz/clearance");

    driver.sleep(3000);

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

    //sprintfit
    await driver.get(
        "https://www.sprintfit.co.nz/products/clearance?pgNmbr=2&pgSize=25&isScrollChunk=true&chunkNumber=2"
    );

    driver.sleep(3000);

    const products = await driver.findElements(By.className("product"));
    console.log(
        `Searching SprintFit Clearance - found ${products.length} items`
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

    setInterval(function () {
        driver.quit();
    }, 20000);
};

scrape();
