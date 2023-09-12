const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://alux444.github.io/tracktrekker/");

    //click the get started button
    await driver.findElement(By.className("button1")).click();

    await driver.sleep(3000);

    try {
        // Locate the input element by its ID
        const inputElement = await driver.findElement(By.id("songSearchBar"));

        //search for songs
        await inputElement.sendKeys("kendrick lamar");
        await driver
            .findElement(By.xpath("//button[.//span[text()='Search']]"))
            .click();

        await driver.sleep(5000);

        //add first 5 songs
        const buttonElements = await driver.findElements(
            By.css(".buttonselect.left-2")
        );

        console.log(buttonElements);
        for (let i = 0; i < 5 && i < buttonElements.length; i++) {
            await buttonElements[i].click();
        }

        await driver.findElement(By.id("getResultsButton")).click();

        await driver.sleep(5000);

        //get all song display elements
        const results = await driver.findElements(By.className("songDisplay"));

        for (const result of results) {
            const res = await result.getText();
            console.log(res);
        }
    } catch (error) {
        console.error("Couldn't find songSearchBar:", error);
    }

    setInterval(function () {
        driver.quit();
    }, 20000);
};

scrape();
