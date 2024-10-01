import * as fs from 'fs';
import { ThenableWebDriver } from 'selenium-webdriver';
import { AuthService } from 'src/auth/auth.service';


export class CookiesService {
    constructor(
        private readonly authService: AuthService,
    ) {}

    public async load(driver: ThenableWebDriver): Promise<void> {
        try {
            // Проверяем наличие файла cookies.json
            if (!fs.existsSync('cookies.json')) {
                fs.writeFileSync('cookies.json', '[]', 'utf-8'); // Создаем файл с пустым массивом, если файл не существует
            }

            // Переменная для хранения cookies
            let cookies: any[] = [];

            try {
                // Чтение cookies из файла
                const fileContent = fs.readFileSync('cookies.json', 'utf-8');
                
                // Проверяем, пустой ли файл или нет
                if (fileContent.trim()) {
                    cookies = JSON.parse(fileContent); // Парсим содержимое, если файл не пустой
                } else {
                    console.log('Файл cookies.json пустой');
                }

                // Если файл пуст или cookies не найдены, выполняем авторизацию
                if (!Array.isArray(cookies) || cookies.length === 0) {
                    throw new Error('Cookies not found or file is empty');
                }

                console.log('Cookies успешно загружены из файла:', cookies);
            } catch (error) {
                console.log('Ошибка чтения файла cookies.json. Авторизация через login...');

                // Авторизация и получение новых cookies
                await this.authService.login(driver);
                cookies = await driver.manage().getCookies();

                // Очистка cookies: удаляем любые cookies с недопустимыми значениями
                cookies = cookies.filter(cookie => this.isValidCookie(cookie));

                // Запись cookies в файл
                fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8');
                console.log('Новые cookies получены и сохранены:', cookies);
            }

            // Добавление cookies в браузер
            for (let cookie of cookies) {
                if (this.isValidCookie(cookie)) {
                    await driver.manage().addCookie(cookie);
                }
            }

            console.log('Cookies успешно добавлены в браузер');
        } catch (e) {
            throw new Error(`Failed to load cookies: ${e.message || e}`);
        }
    }

    // Проверка, что cookie имеет допустимые ключи и значения
    private isValidCookie(cookie: any): boolean {
        return cookie && typeof cookie.name === 'string' && typeof cookie.value === 'string';
    }
}