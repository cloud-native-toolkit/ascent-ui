
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi } from './bom/billofmaterials.api';
import { BillofMaterialsService } from './bom/billofmaterials.service';

export * from './bom/billofmaterials.api';
export * from './bom/billofmaterials.service';

Container.bind(BillofMaterialsApi).to(BillofMaterialsService);