
import { MappingDataApi } from './mapping.api';
import { ControlMappingModel } from "../../models/control-mapping/controlMappingModel";
import { ProfileModel } from "../../models/control-mapping/profileModel";
import * as superagent from "superagent";

export class MappingData implements MappingDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/control-mapping';
    }

    async getMappings(filter: any): Promise<ControlMappingModel[]> {
        let url = this.baseUrl;
        if (filter) {
            url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
        }
        return superagent
            .get(url)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async getServiceMappings(serviceId: string): Promise<ControlMappingModel> {
        return superagent
            .get(this.baseUrl + "/service/" + serviceId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async getArchMappings(archId: string): Promise<ControlMappingModel> {
        return superagent
            .get(this.baseUrl + "/architecture/" + archId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async addMapping(mappingDetails: any): Promise<ControlMappingModel> {
        return superagent
            .post(this.baseUrl)
            .send(mappingDetails)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
    async updateMapping(mappingId: string, mappingDetails: any): Promise<any> {
        return superagent
            .patch(this.baseUrl + '/' + mappingId)
            .send(mappingDetails)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
    async deleteMapping(mapping: any): Promise<any> {
        return superagent
            .delete(this.baseUrl)
            .send(mapping)
            .set('accept', 'application/json')
            .then(res => {
                return res;
            })
            .catch(err => {
                return err.response;
            });
    }
    async getProfiles(filter: any): Promise<ProfileModel[]> {
        let url = "/api/mapping/profiles";
        if (filter) {
            url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
        }
        return superagent
            .get(url)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async addProfile(file: FormData): Promise<ProfileModel> {
        let url = "/api/mapping/profiles/import";
        return superagent
            .post(url)
            .send(file)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
}
