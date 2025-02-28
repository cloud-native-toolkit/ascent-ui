
interface Requirement {
  id: string;
  description?: string;
  risk_rating?: string;
  control_type_1?: string;
  control_type_2?: string;
  control_type_3?: string;
  ibm_public_cloud_scope?: string;
  ibm_public_cloud_resp?: string;
  developer_scope?: string;
  developer_resp?: string;
  operator_scope?: string;
  operator_resp?: string;
  consumer_scope?: string;
  consumer_resp?: string;
  scc?: string;
}

export interface ControlDetails {
  id?: string;
  name?: string;
  focus_area?: string;
  family?: string;
  nist_functions?: string;
  risk_desc?: string;
  objective?: string;
  fs_guidance?: string;
  fs_params?: string;
  nist_guidance?: string;
  implementation?: string;
  requirements: Requirement[];
}

export type ControlDetailsWithRelations = ControlDetails;
