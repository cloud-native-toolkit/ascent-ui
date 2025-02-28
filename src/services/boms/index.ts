import {BomsApi} from "@/services/boms/boms.api";
import {BomsRest} from "@/services/boms/boms.rest";

export * from './boms.api';

let _instance: BomsApi;
export const bomsApi = (): BomsApi => _instance || (_instance = new BomsRest());
