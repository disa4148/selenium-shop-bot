import { AuthService } from 'src/auth/auth.service';
export declare class CookiesService {
    private readonly authService;
    constructor(authService: AuthService);
    loadCookies(): Promise<void>;
}
