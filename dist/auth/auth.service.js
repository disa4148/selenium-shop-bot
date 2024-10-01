"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const fs = __importStar(require("fs"));
class AuthService {
    async manualLogin() {
        puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
        const browser = await puppeteer_extra_1.default.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--proxy-server=http://104.164.153.150:64180'
            ]
        });
        const page = await browser.newPage();
        await page.authenticate({
            username: 'AWNFJ75M',
            password: 'B6mDM6mw'
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        try {
            await page.goto('https://deliveroo.ae/');
            console.log('Ожидание 1 минуту для ручной авторизации и прохождения капчи...');
            await this.delay(60000);
            console.log('Ожидание завершено. Попытка сохранить cookies...');
            const cookies = await page.cookies();
            if (cookies.length === 0) {
                console.log('Не удалось получить cookies. Возможно, авторизация не была выполнена.');
            }
            else {
                fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8');
                console.log('Cookies успешно сохранены в файл cookies.json');
            }
        }
        catch (error) {
            console.error('Ошибка во время авторизации:', error.message);
        }
        finally {
            await browser.close();
        }
    }
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map