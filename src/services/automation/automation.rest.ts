import {AutomationRelease, Catalog, QueryParameters} from "../../models";
import {AutomationApi} from "@/services/automation/automation.api";

const baseUrl = '/api/automation';

export class AutomationRest implements AutomationApi {

    async get(id: string): Promise<Blob> {
        return fetch(`${baseUrl}/${id}`)
            .then(res => res.blob())
    }

    async getDetails(id: string): Promise<AutomationRelease> {
        return fetch(`${baseUrl}/${id}/details`)
            .then(res => res.json())
    }

    async getCatalog(parameters?: QueryParameters): Promise<Catalog> {
        const catalog: Catalog = await fetch(`${baseUrl}/catalog/boms`)
            .then(res => res.json())

        if (parameters) {

        }

        return catalog;
    }
}
