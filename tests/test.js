const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const testCase = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://alux444.github.io/tracktrekker/");

    await driver.findElement(By.className("button1")).click();

    setInterval(function () {
        driver.quit();
    }, 10000);
};

testCase();
