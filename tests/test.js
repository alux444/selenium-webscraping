const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const testCase = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://alux444.github.io/tracktrekker/");

    if ((await driver.getTitle()) === "TrackTrekker") {
        console.log("Correct Page Name.");
    } else {
        console.log("Incorrect Page Name.");
    }

    //click the get started button
    await driver.findElement(By.className("button1")).click();

    await driver.sleep(5000);

    try {
        // Locate the input element by its ID
        const inputElement = await driver.findElement(By.id("songSearchBar"));

        const placeholder = await inputElement.getAttribute("placeholder");

        if (placeholder === "Search for Song") {
            console.log("Correct prompt page upon loading");
        }

        await inputElement.sendKeys("Test Query");
    } catch (error) {
        console.error("Couldn't find songSearchBar:", error);
    }

    //switch to artists
    try {
        await driver.findElement(By.xpath("//span[text()='Artists']")).click();

        const inputElement = await driver.findElement(By.id("artistSearchBar"));

        const placeholder = await inputElement.getAttribute("placeholder");

        if (placeholder === "Search for Artist") {
            console.log("Correct prompt page on artists page switch");
        }
    } catch (error) {
        console.log("Error with switching to artists:", error);
    }

    setInterval(function () {
        driver.quit();
    }, 10000);
};

testCase();
