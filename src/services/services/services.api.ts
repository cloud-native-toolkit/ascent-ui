import {BaseRestApi} from "@/services/base-rest.api";
import {Services} from "../../models";

export abstract class ServicesApi extends BaseRestApi<Services> {
    abstract list(): Promise<Services[]>;
    abstract get(id: string): Promise<Services>;
    // TODO determine return type
    abstract getServiceCatalog(id: string): Promise<object>;
}