"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiesService = void 0;
const fs = require("fs");
class CookiesService {
    constructor(authService) {
        this.authService = authService;
    }
    async load(driver) {
        try {
            if (!fs.existsSync('cookies.json')) {
                fs.writeFileSync('cookies.json', '[]', 'utf-8');
            }
            let cookies = [];
            try {
                const fileContent = fs.readFileSync('cookies.json', 'utf-8');
                if (fileContent.trim()) {
                    cookies = JSON.parse(fileContent);
                }
                else {
                    console.log('Файл cookies.json пустой');
                }
                if (!Array.isArray(cookies) || cookies.length === 0) {
                    throw new Error('Cookies not found or file is empty');
                }
                console.log('Cookies успешно загружены из файла:', cookies);
            }
            catch (error) {
                console.log('Ошибка чтения файла cookies.json. Авторизация через login...');
                await this.authService.login(driver);
                cookies = await driver.manage().getCookies();
                cookies = cookies.filter(cookie => this.isValidCookie(cookie));
                fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8');
                console.log('Новые cookies получены и сохранены:', cookies);
            }
            for (let cookie of cookies) {
                if (this.isValidCookie(cookie)) {
                    await driver.manage().addCookie(cookie);
                }
            }
            console.log('Cookies успешно добавлены в браузер');
        }
        catch (e) {
            throw new Error(`Failed to load cookies: ${e.message || e}`);
        }
    }
    isValidCookie(cookie) {
        return cookie && typeof cookie.name === 'string' && typeof cookie.value === 'string';
    }
}
exports.CookiesService = CookiesService;
//# sourceMappingURL=cookies.service.js.map