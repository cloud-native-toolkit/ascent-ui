import {LoggedInUser, User} from "@/models";
import {BaseRestApi} from "@/services/base-rest.api";

export abstract class UsersApi extends BaseRestApi<User> {
    abstract list(): Promise<User[]>;
    abstract get(email: string): Promise<User>;
    abstract update(email: string, userUpdate: Partial<User>): Promise<User>;

    abstract getLoggedInUser(): Promise<LoggedInUser>;
    abstract getCurrentUser(): Promise<User>;
}
