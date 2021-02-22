
import { Container } from 'typescript-ioc';
import { ArchitectureDataApi } from './builder/architecture.mock.api';
import { ArchitectureMock } from './builder/architecture.mock';

export * from './builder/architecture.mock.api';
export * from './builder/architecture.mock';

Container.bind(ArchitectureDataApi).to(ArchitectureMock);
