
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi } from './bom/billofmaterials.api';
import { BillofMaterialsService } from './bom/billofmaterials.service';

import { ArchitectureDataApi } from './builder/architecture.api';
import { ArchitectureService } from './builder/architecture.service';

export * from './bom/billofmaterials.api';
export * from './bom/billofmaterials.service';

export * from './builder/architecture.api';
export * from './builder/architecture.service';

Container.bind(BillofMaterialsApi).to(BillofMaterialsService);
Container.bind(ArchitectureDataApi).to(ArchitectureService);
