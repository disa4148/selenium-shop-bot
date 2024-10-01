import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';  // Импорт плагина stealth

export class CookiesService {
    constructor(
        private readonly authService: AuthService,
    ) {}

    public async loadCookies(): Promise<void> {
        puppeteer.use(StealthPlugin());

        // Инициализируем браузер
        const browser = await puppeteer.launch({
            headless: false,  // Отключаем headless-режим для наблюдения
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        try {
            // Проверяем наличие файла cookies.json
            if (!fs.existsSync('cookies.json')) {
                console.log('Файл cookies.json не найден. Ожидание ручной авторизации...');
                await this.authService.manualLogin();
            } else {
                // Чтение cookies из файла
                const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));

                // Если файл пуст, запрашиваем ручную авторизацию
                if (!cookies || cookies.length === 0) {
                    console.log('Cookies отсутствуют. Авторизация...');
                    await this.authService.manualLogin();
                } else {
                    // Загружаем cookies в браузер
                    await page.setCookie(...cookies);
                    console.log('Cookies загружены в браузер.');
                }
            }

            // Переходим на страницу после загрузки cookies
            await page.goto('https://deliveroo.ae/manager/requisites');
            console.log('Страница загружена.');

        } catch (error) {
            console.error('Ошибка при загрузке cookies или авторизации:', error.message);
        } finally {
            await browser.close(); // Закрываем браузер
        }
    }
}
