export interface AutomationDataModel {
    id: string;
    name: string;
    type: string;
    description: string;
    tags: string[];
    versions: object[];
    provider: string;
}
