import {BackendUser, defaultUserConfig, LoggedInUser, User} from "@/models";
import {UsersApi} from "@/services";
import {BaseRest} from "@/services/base-rest";
import {handleJsonResponse, isRestError} from "@/services/rest-crud.client";

type NewUser = Omit<User, 'architectures' | 'solutions'>;

export class UsersRest extends BaseRest<User, NewUser> implements UsersApi {
    constructor() {
        super('/api/users');
    }

    async getLoggedInUser(): Promise<LoggedInUser> {
        return fetch('/userDetails')
            .then(handleJsonResponse)
    }

    async getCurrentUser(): Promise<User> {
        const loggedInUser: LoggedInUser = await this.getLoggedInUser();

        let backendUser: BackendUser;

        try {
            backendUser = await this.get(loggedInUser.email);
        } catch (error) {
            if (isRestError(error) && error.status === 404) {
                backendUser = await this.add({
                    email: loggedInUser.email,
                    config: defaultUserConfig()
                })
            } else {
                // TODO handle error condition
                backendUser = {
                    email: loggedInUser.email,
                    architectures: [],
                    solutions: []
                };
            }
        }

        if (!backendUser.config) {
            backendUser.config = defaultUserConfig()
        }

        return Object.assign({}, loggedInUser, backendUser);
    }
}
