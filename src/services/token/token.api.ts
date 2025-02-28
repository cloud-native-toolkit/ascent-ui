
export interface TokenResponse {
    token: string;
    error?: string;
}

export abstract class TokenApi {
    abstract getToken(): Promise<TokenResponse>;
}
