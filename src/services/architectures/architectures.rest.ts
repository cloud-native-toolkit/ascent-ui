import {Architectures, Bom, parametersToQueryString, QueryParameters} from "../../models";
import {ArchitecturesApi, NewArchitecture} from ".";
import {BaseRest} from "@/services/base-rest";
import {handleBlobResponse, handleBooleanResponse, handleJsonResponse} from "@/services/rest-crud.client";

export class ArchitecturesRest extends BaseRest<Architectures, NewArchitecture> implements ArchitecturesApi {
    constructor() {
        super('/api/architectures');
    }

    async delete(id: string): Promise<boolean> {
        return this.client.deleteById(id);
    }

    async listUserArchitectures(email: string): Promise<Architectures[]> {
        return fetch(`/api/users/${encodeURIComponent(email)}/architectures`)
            .then(handleJsonResponse);
    }

    async duplicateArchitecture(id: string, data: { arch_id: string; name: string; }): Promise<Architectures> {
        return fetch(
            `${this.client.baseUrl}/${id}/duplicate`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(handleJsonResponse)
    }

    async importBomYaml(newArchitecture: NewArchitecture, overwrite?: boolean, publicArch?: boolean): Promise<Architectures> {
        return fetch(
            `${this.client.baseUrl}/boms/import?public=${publicArch ? 'true' : 'false'}${overwrite ? '&overwrite=true' : ''}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newArchitecture)
            })
            .then(handleJsonResponse)
    }

    async uploadDiagrams(id: string, diagram: { drawio?: string; png?: string; }): Promise<boolean> {
        return fetch(
            `${this.client.baseUrl}/${id}/diagram`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diagram)
            })
            .then(handleJsonResponse)
    }

    async sync(): Promise<object> {
        return fetch(`${this.client.baseUrl}/public/sync`, { method: "POST" })
            .then(handleJsonResponse)
    }

    async getComplianceReport(id: string, profile: string = 'IBM_CLOUD_FS_BP_0_1'): Promise<Blob> {
        return fetch(`${this.client.baseUrl}/${id}/compliance-report?profile=${profile}`)
            .then(handleBlobResponse)
    }

    async getBom(id: string, parameters?: QueryParameters): Promise<Bom[]> {
        return fetch(`${this.client.baseUrl}/${id}/boms${parametersToQueryString(parameters)}`)
            .then(handleJsonResponse)
    }

    async addBom(id: string, bom: Bom): Promise<Bom> {
        return fetch(
            `${this.client.baseUrl}/${id}/boms`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bom)
            })
            .then(handleJsonResponse)
    }
}
