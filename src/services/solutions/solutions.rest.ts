import {Solution} from "@/models";
import {BaseRest} from "@/services/base-rest";
import {CompositeSolution, SolutionsApi} from "@/services/solutions/solutions.api";

export class SolutionsRest extends BaseRest<Solution> implements SolutionsApi {
    constructor() {
        super('/api/solutions');
    }

    async delete(id: string): Promise<boolean> {
        return this.client.deleteById(id);
    }

    async listUserSolutions(email: string): Promise<Solution[]> {
        return fetch(`/api/users/${email}/solutions`)
            .then(response => response.json());
    }

    async getSolutionAutomation(id: string): Promise<Blob> {
        return fetch(`${this.client.baseUrl}/${id}/automation`)
            .then(response => {
                if (response && response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error('Error getting automation');
                }
            })
    }

    async getSolutionFileContent(id: string, fileName: string): Promise<string> {
        return fetch(`${this.client.baseUrl}/${id}/files/${fileName}`)
            .then(response => response.text())
    }

    async deploySolutionToTechzone(id: string): Promise<string> {
        return fetch(`${this.client.baseUrl}/${id}/automation/techzone`)
            .then(response => response.text())
    }

    async uploadDiagrams(id: string, files: Array<{name: string, file: File}>): Promise<boolean> {
        const data = files.reduce((previous: FormData, current: {name: string, file: File}) => {
            previous.append(current.name, current.file);

            return previous;
        }, new FormData())

        return fetch(
            `${this.client.baseUrl}/${id}/files`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: data
            })
            .then(() => true)
    }

    async addComposite(value: CompositeSolution): Promise<Solution> {
        return fetch(
            this.client.baseUrl,
            {
                method: 'POST',
                body: JSON.stringify(value),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(res => res.json());
    }

    async updateComposite(id: string, value: CompositeSolution): Promise<Solution> {
        return fetch(
            `${this.client.baseUrl}/${id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(value),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(res => res.json());
    }

}