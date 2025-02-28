import {Services} from "../../models";
import {BaseRest} from "@/services/base-rest";
import {ServicesApi} from "@/services/services/services.api";

export class ServicesRest extends BaseRest<Services> implements ServicesApi {
    constructor() {
        super('/api/services');
    }

    async getServiceCatalog(id: string): Promise<object> {
        return fetch(`${this.client.baseUrl}/catalog/${id}`)
            .then(res => res.json())
    }

}