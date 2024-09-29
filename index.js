const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

async function loadCookies(driver) {
    try {
        // Чтение cookies из файла
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));

        // Добавление cookies в браузер
        for (let cookie of cookies) {
            await driver.manage().addCookie(cookie);
        }

        console.log('Cookies загружены');
    } catch (error) {
        console.error('Ошибка при загрузке cookies:', error);
    }
}

async function automateRequisites() {
    let driver = new Builder().forBrowser('chrome').build();

    try {
        // Переход на нужную страницу
        await driver.get('https://cumback.ru/manager/requisites');

        // Загружаем cookies
        await loadCookies(driver);

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

    } catch (error) {
        console.error('Ошибка при выполнении скрипта:', error);
    } finally {
        await driver.quit();
    }
}

automateRequisites();
