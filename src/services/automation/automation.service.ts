import { AutomationDataModel } from '../../models/automation/AutomationDataModel';
import { AutomationApi } from './automation.api';
import * as superagent from 'superagent';

export class AutomationService implements AutomationApi {

    baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/automation';
    }

    async getAutomation(automationId: string): Promise<AutomationDataModel> {
        return superagent
            .get(this.baseUrl + '/' + automationId + '/details')
            .set('accept', 'application/json')
            .then(res => {
                if (res.status !== 200) {
                    console.log(res)
                }
                return res.body || {};
            })
            .catch(err => {
                return err;
            });
    }

}
