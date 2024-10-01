//const { Builder, By, until } = require('selenium-webdriver');
import { Builder, By, ThenableWebDriver, until } from 'selenium-webdriver';
import * as fs from 'fs';
import { CookiesService } from './cookies/cookies.service'; 
import { AuthService } from './auth/auth.service';


async function automateRequisites() {
    let authService = new AuthService;
    let cookiesService = new CookiesService(authService);
    let driver: ThenableWebDriver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://cumback.ru/manager/requisites');

        // Загружаем cookies
        await cookiesService.load(driver);

        // Обновляем страницу после загрузки cookies
        await driver.navigate().refresh();

        // Явное ожидание, пока элемент станет кликабельным
        let addRequisitesButton = await driver.wait(until.elementLocated(By.css('button.bg-active.rounded-xl')), 10000);

        // Скролл к кнопке (если она вне видимости)
        await driver.executeScript("arguments[0].scrollIntoView();", addRequisitesButton);
        
        // Ожидание, что кнопка активна и кликабельна
        await driver.wait(until.elementIsEnabled(addRequisitesButton), 10000);
        
        // Клик на кнопку "Добавить реквизиты"
        await addRequisitesButton.click();
        
        console.log('Клик по кнопке выполнен, форма открыта');

        // Ожидаем появления формы для заполнения реквизитов
        await driver.wait(until.elementLocated(By.name('cardNumber')), 10000);
        
        // Заполняем поля формы
        const cardNumberInput = await driver.findElement(By.name('cardNumber'));
        const holderNameInput = await driver.findElement(By.name('holderName'));
        const bankNameInput = await driver.findElement(By.name('bankName'));

        // Вводим случайные данные
        await cardNumberInput.clear();
        await cardNumberInput.sendKeys('5276323456789010');
        
        await holderNameInput.clear();
        await holderNameInput.sendKeys('IVAN IVAN IVANOVICH');
        
        await bankNameInput.clear();
        await bankNameInput.sendKeys('Т-Банк');

        console.log('Форма заполнена данными');

        // Клик на кнопку "Добавить реквизиты" для отправки формы
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        
        // Ожидание кликабельности кнопки и клик
        await driver.wait(until.elementIsEnabled(submitButton), 10000);
        await submitButton.click();

        console.log('Форма отправлена');

        // Ждем 15 секунд, чтобы запрос успел обработаться
        await driver.sleep(15000);

    } catch (e) {
        throw new Error(e);
    } finally {
        await driver.quit();
    }
}

automateRequisites();
