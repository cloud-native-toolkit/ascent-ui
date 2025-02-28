import {TokenApi, TokenResponse} from ".";

export class TokenRest implements TokenApi {
    async getToken(): Promise<TokenResponse> {
        return fetch('/api/token')
            .then(res => res.json())
            .catch(error => {
                console.error(error)
                throw error
            });
    }
}
