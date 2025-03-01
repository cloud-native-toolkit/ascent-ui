import {AutomationRelease, Catalog, QueryParameters} from "../../models";
import {AutomationApi} from "@/services/automation/automation.api";
import {handleBlobResponse, handleJsonResponse} from "@/services/rest-crud.client";

const baseUrl = '/api/automation';

export class AutomationRest implements AutomationApi {

    async get(id: string): Promise<Blob> {
        return fetch(`${baseUrl}/${id}`)
            .then(handleBlobResponse)
    }

    async getDetails(id: string): Promise<AutomationRelease> {
        return fetch(`${baseUrl}/${id}/details`)
            .then(handleJsonResponse)
    }

    async getCatalog(parameters?: QueryParameters): Promise<Catalog> {
        const catalog: Catalog = await fetch(`${baseUrl}/catalog/boms`)
            .then(handleJsonResponse)

        // TODO implement pagination

        return catalog;
    }
}
