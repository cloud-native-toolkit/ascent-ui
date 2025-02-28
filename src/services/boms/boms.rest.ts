import {Bom} from "../../models";
import {BaseRest} from "@/services/base-rest";
import {BomsApi} from "@/services/boms/boms.api";

export class BomsRest extends BaseRest<Bom> implements BomsApi {
    constructor() {
        super('/api/boms');
    }

    async getComposite(archId: string): Promise<object> {
        return fetch(`${this.client.baseUrl}/services/${archId}`)
            .then(res => res.json())
    }

    async getDetails(id: string): Promise<object> {
        return fetch(`${this.client.baseUrl}/${id}/composite`)
            .then(res => res.json())
    }

    async delete(id: string): Promise<boolean> {
        return this.client.deleteById(id);
    }
}