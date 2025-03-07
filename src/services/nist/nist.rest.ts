import {Nist} from "../../models";
import {NistApi} from "@/services/nist/nist.api";
import {BaseRest} from "@/services/base-rest";

export class NistRest extends BaseRest<Nist> implements NistApi {
    constructor() {
        super('/api/nist');
    }
}
