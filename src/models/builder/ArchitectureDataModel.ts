export interface ArchiectureDataModel {
    arch_id: string;
    name: string;
    short_desc: string;
    long_desc: string;
    public: boolean;
    production_ready: boolean;
    automation_variables: string;
    boms: object[],
    owners: object[]
}
