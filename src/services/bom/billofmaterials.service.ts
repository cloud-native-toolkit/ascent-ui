import { BillofMaterialsDataModel } from '../../models/bom/BillofMaterialsDataModel';
import { BillofMaterialsApi } from './billofmaterials.api';
import * as superagent from 'superagent';

export class BillofMaterialsService implements BillofMaterialsApi {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/architectures/';
    }

    async getBOM(archiId: string): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .get(this.baseUrl + archiId + '/boms')
            .set('accept', 'application/json')
            .then(res => {
                /* var dataObj: { [x: string]: any; };
                 res.body.forEach((element: any) => {
                     Object.keys(element).forEach((key, index) => {
                         console.log(index + "==" + key);
                     });
                     console.log(dataObj);
                 });*/

                return res.body || [];
            });
    }

}
