const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");

const fs = require("fs");

const logFilePath = "bruteforce.txt";

const logStream = fs.createWriteStream(logFilePath, { flags: "w" });

writeToText = function (nonce, score) {
    const message = `${nonce} - Score:${score}\n-----`;
    logStream.write(message + "\n");
};

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    const name = "Jamie Lee";
    let nonce = "0";
    let highscore = 0;

    await driver.get("https://2023challenge.21e8.nz/");

    await driver
        .findElement(By.xpath("//input[@placeholder='Your Name']"))
        .sendKeys(name);

    const nonceInput = await driver.findElement(
        By.xpath("//input[@placeholder='Nonce']")
    );

    const scoreDiv = await driver.findElement(By.className("score"));

    await nonceInput.sendKeys(nonce);

    let currentScore = (await scoreDiv.getText()).split(":")[1];
    if (currentScore > highscore) {
        highscore = score;
        writeToText(nonce, score);
    }

    while (true) {
        nonce = incrementNonce(nonce);
        await nonceInput.clear();
        await nonceInput.sendKeys(nonce);
        currentScore = (await scoreDiv.getText()).split(":")[1];
        if (currentScore > highscore) {
            highscore = currentScore;
            writeToText(nonce, currentScore);
        }
    }

    driver.quit();
    logStream.end();
};

function incrementNonce(nonce) {
    const chars = "0123456789abcdef";
    let nonceChars = nonce.split("");
    let carry = 1;
    for (let i = nonceChars.length - 1; i >= 0; i--) {
        const index = chars.indexOf(nonceChars[i]);
        const newIndex = (index + carry) % chars.length;
        nonceChars[i] = chars[newIndex];
        carry = Math.floor((index + carry) / chars.length);
    }
    if (carry > 0) {
        nonceChars.unshift(chars[carry - 1]);
    }
    return nonceChars.join("");
}

scrape();
