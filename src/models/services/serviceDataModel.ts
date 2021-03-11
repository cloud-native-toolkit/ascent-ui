export interface ServiceDataModel {
    service_id: string;
    grouping: string;
    ibm_catalog_service: string;
    desc: string;
    deployment_method: string;
    fs_certified: string;
    compliance_status: string;
    provision: string;
    cloud_automation_id: string;
    hybrid_automation_id: string;
    controls: Array<Object>;
}