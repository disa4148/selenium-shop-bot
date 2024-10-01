import { AuthService } from './auth/auth.service';
import { CookiesService } from './cookies/cookies.service';

async function automateRequisites() {
    const authService = new AuthService();
    const cookiesService = new CookiesService(authService);

    try {
        // Загружаем cookies или выполняем авторизацию
        await cookiesService.loadCookies();

        // Далее можешь добавить логику работы с веб-страницей после авторизации

        console.log('Завершение работы скрипта.');
    } catch (error) {
        console.error('Ошибка при выполнении скрипта:', error.message);
    }
}

automateRequisites();
