import { ArchitectureDataModel} from './ArchitectureDataModel';

export interface SolutionDataModel {
    id: string,
    name: string,
    short_desc: string,
    long_desc: string,
    readme: string,
    architectures: ArchitectureDataModel[],
    owners: object[]
}
