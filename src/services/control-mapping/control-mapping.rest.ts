import {ControlMapping, parametersToQueryString, Profile, QueryParameters} from "../../models";
import {ControlMappingApi} from ".";
import {BaseRest} from "@/services/base-rest";

export class ControlMappingRest extends BaseRest<ControlMapping> implements ControlMappingApi {
    constructor() {
        super('/api/control-mapping');
    }

    async delete(mapping: ControlMapping): Promise<boolean> {
        return this.client.deleteByObject(mapping);
    }

    async listServiceMappings(serviceId: string): Promise<object> {
        return fetch(
            `${this.client.baseUrl}/service/${serviceId}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
    }

    async listArchMappings(archId: string): Promise<object> {
        return fetch(
            `${this.client.baseUrl}/architecture/${archId}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
    }

    async listProfiles(parameters?: QueryParameters): Promise<Profile> {
        const url = "/api/mapping/profiles";

        return fetch(
            `${url}${parametersToQueryString(parameters)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
    }

    async importProfile(file: object): Promise<Profile> {
        return fetch(
            "/api/mapping/profiles/import",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(file)
            })
            .then(res => res.json())
    }
}
