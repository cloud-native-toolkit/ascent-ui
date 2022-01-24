export interface ArchitectureDataModel {
    arch_id: string;
    name: string;
    platform: string;
    short_desc: string;
    long_desc: string;
    public: boolean;
    production_ready: boolean;
    yaml: string;
    boms: object[],
    owners: object[]
}
