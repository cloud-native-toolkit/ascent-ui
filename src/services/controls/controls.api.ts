import {Controls, QueryParameters} from "../../models";
import {BaseRestApi} from "@/services/base-rest.api";

export abstract class ControlsApi extends BaseRestApi<Controls> {
    abstract list(parameters?: QueryParameters): Promise<Controls[]>;
    abstract get(id: string, parameters?: QueryParameters): Promise<Controls>;
}
