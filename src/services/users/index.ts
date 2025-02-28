import {UsersApi} from "./users.api";
import {UsersRest} from "./users.rest";

export * from "./users.api"

let _instance: UsersApi;
export const usersApi = (): UsersApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new UsersRest()
}
