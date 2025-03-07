import {AutomationRelease, Catalog, QueryParameters} from "../../models";

export abstract class AutomationApi {
    abstract get(id: string): Promise<Blob>;
    abstract getDetails(id: string): Promise<AutomationRelease>;
    // TODO determine return type
    abstract getCatalog(parameters?: QueryParameters): Promise<Catalog>;
}
