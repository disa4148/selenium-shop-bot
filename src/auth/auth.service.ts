import { By, ThenableWebDriver, until } from "selenium-webdriver";

export class AuthService {
    async login(driver: ThenableWebDriver) {
        try {
            await driver.get('https://cumback.ru/signin');
            const usernameInput = await driver.findElement(By.name('account'));
            await usernameInput.clear();
            await usernameInput.sendKeys(process.env.LOGIN as string);

            const passwordInput = await driver.findElement(By.name('password'));
            await passwordInput.clear();
            await passwordInput.sendKeys(process.env.PASSWORD as string);

            const loginButton = await driver.findElement(By.css('button[type="submit"]'));
            await loginButton.click();

            await driver.wait(until.elementLocated(By.xpath("//div[text()='Вы успешно авторизовались!']")), 20000);
            await driver.get('https://cumback.ru/manager/requisites');
        } catch(e) {
            throw new Error(e);
        }
    }
}