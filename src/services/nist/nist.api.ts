import {Nist} from "../../models";
import {BaseRestApi} from "@/services/base-rest.api";

export abstract class NistApi extends BaseRestApi<Nist> {
    abstract list(): Promise<Nist[]>;
    abstract get(id: string): Promise<Nist>;
}
