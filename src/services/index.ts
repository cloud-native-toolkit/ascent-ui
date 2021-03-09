
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi } from './bom/billofmaterials.api';
import { BillofMaterialsService } from './bom/billofmaterials.service';

import { ArchitectureDataApi } from './builder/architecture.api';
import { ArchitectureService } from './builder/architecture.service';

import { ServiceDataApi } from './services/service.api';
import { ServiceData } from './services/services.service';

import { ControlsDataApi } from './controls/controls.api';
import { ControlsData } from './controls/controls.service';

import { NistDataApi } from './nist/nist.api';
import { NistData } from './nist/nist.service';

export * from './bom/billofmaterials.api';
export * from './bom/billofmaterials.service';

export * from './builder/architecture.api';
export * from './builder/architecture.service';

export * from './services/service.api';
export * from './services/services.service';

export * from './controls/controls.api';
export * from './controls/controls.service';

export * from './nist/nist.api';
export * from './nist/nist.service';

Container.bind(BillofMaterialsApi).to(BillofMaterialsService);
Container.bind(ArchitectureDataApi).to(ArchitectureService);
Container.bind(ServiceDataApi).to(ServiceData);
Container.bind(ControlsDataApi).to(ControlsData);
Container.bind(NistDataApi).to(NistData);
