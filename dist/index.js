"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const cookies_service_1 = require("./cookies/cookies.service");
const auth_service_1 = require("./auth/auth.service");
async function automateRequisites() {
    let authService = new auth_service_1.AuthService;
    let cookiesService = new cookies_service_1.CookiesService(authService);
    let driver = new selenium_webdriver_1.Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://cumback.ru/manager/requisites');
        await cookiesService.load(driver);
        await driver.navigate().refresh();
        let addRequisitesButton = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css('button.bg-active.rounded-xl')), 10000);
        await driver.executeScript("arguments[0].scrollIntoView();", addRequisitesButton);
        await driver.wait(selenium_webdriver_1.until.elementIsEnabled(addRequisitesButton), 10000);
        await addRequisitesButton.click();
        console.log('Клик по кнопке выполнен, форма открыта');
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('cardNumber')), 10000);
        const cardNumberInput = await driver.findElement(selenium_webdriver_1.By.name('cardNumber'));
        const holderNameInput = await driver.findElement(selenium_webdriver_1.By.name('holderName'));
        const bankNameInput = await driver.findElement(selenium_webdriver_1.By.name('bankName'));
        await cardNumberInput.clear();
        await cardNumberInput.sendKeys('5276323456789010');
        await holderNameInput.clear();
        await holderNameInput.sendKeys('IVAN IVAN IVANOVICH');
        await bankNameInput.clear();
        await bankNameInput.sendKeys('Т-Банк');
        console.log('Форма заполнена данными');
        const submitButton = await driver.findElement(selenium_webdriver_1.By.css('button[type="submit"]'));
        await driver.wait(selenium_webdriver_1.until.elementIsEnabled(submitButton), 10000);
        await submitButton.click();
        console.log('Форма отправлена');
        await driver.sleep(15000);
    }
    catch (e) {
        throw new Error(e);
    }
    finally {
        await driver.quit();
    }
}
automateRequisites();
//# sourceMappingURL=index.js.map