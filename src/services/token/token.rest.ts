import {TokenApi, TokenResponse} from ".";
import {handleJsonResponse} from "@/services/rest-crud.client";

export class TokenRest implements TokenApi {
    async getToken(): Promise<TokenResponse> {
        return fetch('/api/token')
            .then(handleJsonResponse)
    }
}
