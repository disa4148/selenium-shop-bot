import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';

export class AuthService {
    async manualLogin(): Promise<void> {
        puppeteer.use(StealthPlugin());

        const browser = await puppeteer.launch({
            headless: false,  // Чтобы можно было видеть процесс
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--proxy-server=http://104.164.153.150:64180'  // Прокси-сервер (HTTP прокси)
            ]
        });

        const page = await browser.newPage();

        // Аутентификация на прокси-сервере
        await page.authenticate({
            username: 'AWNFJ75M',  // Логин для прокси
            password: 'B6mDM6mw'   // Пароль для прокси
        });

        // Устанавливаем кастомный User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        try {
            // Переходим на сайт
            await page.goto('https://deliveroo.ae/');

            console.log('Ожидание 1 минуту для ручной авторизации и прохождения капчи...');
            await this.delay(60000);  // Ожидание для прохождения авторизации

            console.log('Ожидание завершено. Попытка сохранить cookies...');
            const cookies = await page.cookies();

            if (cookies.length === 0) {
                console.log('Не удалось получить cookies. Возможно, авторизация не была выполнена.');
            } else {
                // Сохраняем cookies в файл cookies.json
                fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8');
                console.log('Cookies успешно сохранены в файл cookies.json');
            }

        } catch (error) {
            console.error('Ошибка во время авторизации:', error.message);
        } finally {
            await browser.close();
        }
    }

    // Простая функция задержки
    private delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
