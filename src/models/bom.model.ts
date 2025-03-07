import {KubernetesResource, ServerSolution, Services} from './index';


export interface BillOfMaterialModuleDependency {
  name?: string;
  id?: string;
  ref: string;
  optional?: boolean;
}

export interface BillOfMaterialModuleVariable {
  name: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  value?: any;
  description?: string;
  alias?: string;
  scope?: string;
  required?: boolean;
  sensitive?: boolean;
}

export interface BillOfMaterialModuleOutput {
  name: string;
  description?: string;
  alias?: string;
  scope?: string;
}

export interface BillOfMaterialModuleProvider {
  name: string;
  ref?: string;
}

export interface BaseBillOfMaterialModule {
  alias?: string;
  version?: string;
  default?: boolean;
  variables?: BillOfMaterialModuleVariable[];
  outputs?: BillOfMaterialModuleOutput[];
  dependencies?: BillOfMaterialModuleDependency[];
  providers?: BillOfMaterialModuleProvider[];
}

export interface BillOfMaterialModuleById extends BaseBillOfMaterialModule {
  id: string;
  name?: string;
}

export interface BillOfMaterialModuleByName extends BaseBillOfMaterialModule {
  name: string;
  id?: string;
}

export declare type BillOfMaterialModule = BillOfMaterialModuleById | BillOfMaterialModuleByName;

export interface BillOfMaterialVariable {
  name: string;
  description?: string;
  ref?: string;
  value?: string;
  alias?: string;
  required?: boolean;
  sensitive?: boolean;
}

export interface BillOfMaterialOutput {
  name: string;
  alias?: string;
}

export interface BillOfMaterialProviderVariable {
  name: string;
  alias: string;
  scope: string;
}

export interface BillOfMaterialProvider {
  name: string;
  alias?: string;
  source?: string;
  variables?: BillOfMaterialProviderVariable[];
}

export interface BillOfMaterialSpec {
  version?: string;
  modules: Array<string | BillOfMaterialModule>;
  variables?: BillOfMaterialVariable[];
  outputs?: BillOfMaterialOutput[];
  providers?: BillOfMaterialProvider[];
}

export type BillOfMaterial = KubernetesResource<BillOfMaterialSpec>;

export interface BillOfMaterialVersion {
  version: string;
  metadataUrl?: string;
  content?: BillOfMaterial | ServerSolution;
}

export interface Bom {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  category: string;
  subCategory?: string;
  iconUrl?: string;
  type: string;
  cloudProvider?: string;
  versions: BillOfMaterialVersion[];
}

export interface Bom1 {
  _id?: string;
  arch_id: string;
  service_id: string;
  desc: string;
  yaml: string;
  service: Services;
  // TODO where do these go?
  cloudProvider?: string;
  category?: string;
  name?: string;
  iconUrl?: string;
  displayName?: string;
}
