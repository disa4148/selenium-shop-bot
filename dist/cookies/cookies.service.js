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
exports.CookiesService = void 0;
const fs = __importStar(require("fs"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
class CookiesService {
    constructor(authService) {
        this.authService = authService;
    }
    async loadCookies() {
        puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
        const browser = await puppeteer_extra_1.default.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        try {
            if (!fs.existsSync('cookies.json')) {
                console.log('Файл cookies.json не найден. Ожидание ручной авторизации...');
                await this.authService.manualLogin();
            }
            else {
                const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
                if (!cookies || cookies.length === 0) {
                    console.log('Cookies отсутствуют. Авторизация...');
                    await this.authService.manualLogin();
                }
                else {
                    await page.setCookie(...cookies);
                    console.log('Cookies загружены в браузер.');
                }
            }
            await page.goto('https://deliveroo.ae/manager/requisites');
            console.log('Страница загружена.');
        }
        catch (error) {
            console.error('Ошибка при загрузке cookies или авторизации:', error.message);
        }
        finally {
            await browser.close();
        }
    }
}
exports.CookiesService = CookiesService;
//# sourceMappingURL=cookies.service.js.map