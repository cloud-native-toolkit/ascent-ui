import {Architectures, Bom, QueryParameters} from "../../models";
import {BaseRestApi} from "@/services/base-rest.api";

export type NewArchitecture = Omit<Architectures, "arch_id">

export abstract class ArchitecturesApi extends BaseRestApi<Architectures, NewArchitecture>{
    abstract list(parameters?: QueryParameters): Promise<Architectures[]>;
    abstract add(newValue: NewArchitecture): Promise<Architectures>;
    abstract get(id: string, parameters?: QueryParameters): Promise<Architectures>;
    abstract update(id: string, updatedValue: Architectures): Promise<Architectures>;
    abstract delete(id: string): Promise<boolean>;

    abstract listUserArchitectures(email: string): Promise<Architectures[]>;

    abstract duplicateArchitecture(id: string, data: {arch_id: string, name: string}): Promise<Architectures>;
    abstract importBomYaml(newArchitecture: NewArchitecture, overwrite?: boolean, publicArch?: boolean): Promise<Architectures>;
    abstract uploadDiagrams(id: string, diagram: {drawio?: string, png?: string}): Promise<boolean>;

    // TODO determine return type
    abstract sync(): Promise<object>;
    abstract getComplianceReport(id: string, profile?: string): Promise<Blob>;

    abstract addBom(id: string, bom: Bom): Promise<Bom>;
    abstract getBom(id: string, parameters?: QueryParameters): Promise<Bom[]>;
}
