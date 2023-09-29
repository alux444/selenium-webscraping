const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");

const fs = require("fs");

const logFilePath = "jobs.txt";

const logStream = fs.createWriteStream(logFilePath, { flags: "w" });

writeIndeed = function (job) {
    const message = `${job.title}\n${job.link}\n-----`;
    logStream.write(message + "\n");
};

writeSeek = function (job) {
    const message = `${job.title} - ${job.company}\n${job.link}\n-----`;
    logStream.write(message + "\n");
};

const scrape = async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    //visit gradconnection
    // await driver.get(
    //     "https://au.gradconnection.com/graduate-jobs/engineering-civil-structural/melbourne/?ordering=-recent_job_created"
    // );

    // driver.sleep(5000);

    // const gradConnectionJobs = {
    //     title: "Grad Connection Jobs - By New",
    //     jobs: [],
    // };

    // const listingElements = await driver.findElements(
    //     By.className("campaign-listing-box")
    // );
    // console.log(listingElements.length);

    // for (let i = 0; i < listingElements.length; i++) {
    //     console.log(i);
    //     try {
    //         const titleElement = await listingElements[i].findElement(
    //             By.className("box-header-title")
    //         );

    //         const title = await titleElement.getText();
    //         const link = await titleElement.getAttribute("href");
    //         const employer = await listingElements[i]
    //             .findElement(By.className("box-employer-name"))
    //             .getText();

    //         const results = {
    //             title: title,
    //             link: link,
    //             employer: employer,
    //         };
    //         console.log(results);
    //         gradConnectionJobs.jobs.push(results);
    //     } catch (error) {}
    // }

    //visit indeed
    await driver.get(
        "https://au.indeed.com/jobs?q=graduate+civil+engineer&l=Melbourne+VIC&vjk=a194741051536416"
    );

    driver.sleep(5000);

    const indeedJobs = {
        title: "Indeed Jobs",
        jobs: [],
    };

    await scrapeFromIndeed(driver, indeedJobs);

    let nextPageAvailable = true;
    while (nextPageAvailable) {
        nextPageAvailable = await goToNextIndeedPage(driver, indeedJobs);
        if (nextPageAvailable) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    for (job of indeedJobs.jobs) {
        writeIndeed(job);
    }

    //visit seek
    await driver.get(
        "https://www.seek.co.nz/Graduate-jobs-in-engineering/civil-structural-engineering/in-All-Melbourne-VIC-AU?sortmode=ListedDate"
    );

    driver.sleep(5000);

    const seekJobs = { title: "Seek Jobs", jobs: [] };

    await scrapeFromSeek(driver, seekJobs);

    let nextPageAvailableSeek = true;
    while (nextPageAvailableSeek) {
        nextPageAvailableSeek = await goToNextSeekPage(driver, seekJobs);
        if (nextPageAvailableSeek) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    for (job of seekJobs.jobs) {
        writeSeek(job);
    }

    console.log("Scrape Completed.");

    driver.quit();
    logStream.end();
};

const goToNextIndeedPage = async (driver, indeedJobs) => {
    try {
        const nextPageButton = await driver.findElement(
            By.xpath("//a[@data-testid='pagination-page-next']")
        );
        await nextPageButton.click();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const closePopupButton = await driver.findElement(
                By.xpath("//button[@aria-label='close']")
            );

            await closePopupButton.click();
        } catch (error) {}

        await scrapeFromIndeed(driver, indeedJobs);

        return true;
    } catch (error) {
        return false;
    }
};

const scrapeFromIndeed = async (driver, indeedJobs) => {
    const jobElements = await driver.findElements(By.className("cardOutline"));
    console.log(jobElements.length);

    for (let i = 0; i < jobElements.length; i++) {
        try {
            const titleElement = await jobElements[i].findElement(
                By.className("resultContent")
            );

            const title = await titleElement.getText();
            const link = await titleElement
                .findElement(By.className("jcs-JobTitle"))
                .getAttribute("href");

            const results = {
                title: title.replace(/\n/g, " - "),
                link: link,
            };
            console.log(results);
            indeedJobs.jobs.push(results);
        } catch (error) {}
    }
};

const goToNextSeekPage = async (driver, seekJobs) => {
    try {
        const nextPageButton = await driver.findElement(
            By.xpath("//a[@aria-label='Next']")
        );
        await nextPageButton.click();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await scrapeFromSeek(driver, seekJobs);

        return true;
    } catch (error) {
        return false;
    }
};

const scrapeFromSeek = async (driver, seekJobs) => {
    const jobElements = await driver.findElements(
        By.xpath("//article[@data-card-type='JobCard']")
    );
    console.log(jobElements.length);

    for (let i = 0; i < jobElements.length; i++) {
        try {
            const title = await jobElements[i].getAttribute("aria-label");
            const linkElements = await jobElements[i].findElements(
                By.xpath(".//a")
            );

            const link = await linkElements[0].getAttribute("href");
            const company = await linkElements[2].getText();

            const results = {
                title: title,
                link: link,
                company: company,
            };

            console.log(results);
            seekJobs.jobs.push(results);
        } catch (error) {}
    }
};

scrape();
