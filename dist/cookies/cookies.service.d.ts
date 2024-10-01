import { ThenableWebDriver } from 'selenium-webdriver';
import { AuthService } from 'src/auth/auth.service';
export declare class CookiesService {
    private readonly authService;
    constructor(authService: AuthService);
    load(driver: ThenableWebDriver): Promise<void>;
    private isValidCookie;
}
