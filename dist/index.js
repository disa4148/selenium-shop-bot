"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("./auth/auth.service");
const cookies_service_1 = require("./cookies/cookies.service");
async function automateRequisites() {
    const authService = new auth_service_1.AuthService();
    const cookiesService = new cookies_service_1.CookiesService(authService);
    try {
        await cookiesService.loadCookies();
        console.log('Завершение работы скрипта.');
    }
    catch (error) {
        console.error('Ошибка при выполнении скрипта:', error.message);
    }
}
automateRequisites();
//# sourceMappingURL=index.js.map