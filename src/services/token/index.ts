import {TokenApi} from "./token.api";
import {TokenRest} from "./token.rest";

export * from './token.api';

let _instance: TokenApi
export const tokenApi = (): TokenApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new TokenRest()
}
