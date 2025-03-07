import {BaseRestApi} from "@/services/base-rest.api";
import {Bom} from "../../models";

export abstract class BomsApi extends BaseRestApi<Bom> {
    abstract list(): Promise<Bom[]>;
    abstract add(bom: Bom): Promise<Bom>;
    abstract get(id: string): Promise<Bom>;
    abstract update(id: string, updatedValue: Bom): Promise<Bom>;
    abstract delete(id: string): Promise<boolean>;

    // TODO determine return type
    abstract getDetails(id: string): Promise<object>;
    // TODO determine return type
    abstract getComposite(archId: string): Promise<object>;
}
