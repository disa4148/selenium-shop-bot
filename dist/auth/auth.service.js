"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
class AuthService {
    async login(driver) {
        try {
            await driver.get('https://cumback.ru/signin');
            const usernameInput = await driver.findElement(selenium_webdriver_1.By.name('account'));
            await usernameInput.clear();
            await usernameInput.sendKeys(process.env.LOGIN);
            const passwordInput = await driver.findElement(selenium_webdriver_1.By.name('password'));
            await passwordInput.clear();
            await passwordInput.sendKeys(process.env.PASSWORD);
            const loginButton = await driver.findElement(selenium_webdriver_1.By.css('button[type="submit"]'));
            await loginButton.click();
            await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//div[text()='Вы успешно авторизовались!']")), 20000);
            await driver.get('https://cumback.ru/manager/requisites');
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map