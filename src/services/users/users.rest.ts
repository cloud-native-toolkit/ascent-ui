import {BackendUser, defaultUserConfig, LoggedInUser, User} from "../../models";
import {UsersApi} from ".";
import {BaseRest} from "@/services/base-rest";

export class UsersRest extends BaseRest<User> implements UsersApi {
    constructor() {
        super('/api/users');
    }

    async getLoggedInUser(): Promise<LoggedInUser> {
        return fetch('/userDetails')
            .catch(error => {
                console.error(error)
                throw error
            })
            .then(res => res.json())
    }

    async getCurrentUser(): Promise<User> {
        const loggedInUser: LoggedInUser = await this.getLoggedInUser();

        let backendUser: BackendUser;

        try {
            backendUser = await this.get(loggedInUser.email);
        } catch (error) {
            console.error(`Unable to get user details: ${loggedInUser.email}`, error)
            backendUser = {
                email: loggedInUser.email,
                architectures: [],
                solutions: [],
            };
        }

        if (!backendUser.config) {
            backendUser.config = defaultUserConfig()
        }

        return Object.assign({}, loggedInUser, backendUser);
    }
}
