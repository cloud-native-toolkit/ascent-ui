import {Bom} from "@/models/bom.model";
import {ResourceMetadata} from "@/models/kubernetes.model";

export interface ProviderModel {
    name: string;
    alias?: string;
    source?: string;
    dependencies?: ModuleDependency[];
    variables?: ModuleVariable[];
}

export interface ModuleTemplate {
    id: string;
    registryId?: string;
    name: string;
    displayName?: string;
    idAliases?: string[];
    alias?: string;
    default?: boolean;
    originalAlias?: string;
    aliasIds?: string[];
    interfaces?: string[];
    category: string;
    description?: string;
    platforms: string[];
    provider?: 'ibm' | 'k8s';
    providers?: ProviderModel[];
    tags?: string[];
    ibmCatalogId?: string;
    fsReady?: string;
    documentation?: string;
    examplePath?: string;
    license?: string;
    group?: string;
    cloudProvider?: string;
    softwareProvider?: string;
    metadataUrl?: string;
}

export interface ModuleRef {
    source: string;
    version?: string;
}

export interface ModuleDependency {
    id: string;
    preferred?: string;
    refs?: ModuleRef[];
    interface?: string;
    optional?: boolean;
    discriminator?: string;
    manualResolution?: boolean;
    _module?: VersionedModule | VersionedModule[];
}

export interface ModuleOutputRef {
    id: string;
    output: string;
}

export interface ModuleVariable {
    name: string;
    type: string;
    alias?: string;
    scope?: 'module' | 'global' | 'ignore';
    description?: string;
    optional?: boolean;
    default?: string;
    defaultValue?: string;
    moduleRef?: ModuleOutputRef;
    mapper?: 'equality' | 'collect';
    important?: boolean;
    sensitive?: boolean;
}

export interface ModuleOutput {
    name: string;
    description?: string;
    sensitive?: boolean;
}

export interface ModuleVersion {
    version: string;
    dependencies?: ModuleDependency[];
    variables: ModuleVariable[];
    outputs: ModuleOutput[];
    providers?: Array<ProviderModel>;
    terraformVersion?: string;
}

export interface VersionedModule extends ModuleTemplate {
    versions: ModuleVersion[];
}

export interface ModuleIdAlias {
    id: string;
    aliases: string[];
}

export interface CatalogV2MetadataItem {
    name: string;
    displayName: string;
    description: string;
    iconUrl: string;
}

export type CloudProviderMetadata = CatalogV2MetadataItem;

export interface FlavorMetadata extends CatalogV2MetadataItem {
    enabled?: boolean;
}

export interface UseCaseMetadata extends CatalogV2MetadataItem {
    flavor: string;
}

export interface CatalogV2Metadata extends ResourceMetadata {
    cloudProviders?: CloudProviderMetadata[];
    useCases?: UseCaseMetadata[];
    flavors?: FlavorMetadata[];
}

export interface CapabilityModuleDependencyModel {
    module: string;
}

export interface CapabilityInterfaceDependencyModel {
    interface: string;
    excludeModule?: string;
}

export declare type CapabilityDependencyModel = CapabilityInterfaceDependencyModel | CapabilityModuleDependencyModel;

export interface CapabilityDependencyMappingModel {
    source: string;
    destination: string;
    destinationGlobal?: boolean;
}

export interface CapabilityModel {
    name: string;
    providers: CapabilityDependencyModel[];
    consumers: CapabilityDependencyModel[];
    providerAliasModule?: string;
    defaultProviderAlias?: string;
    defaultConsumerAlias?: string;
    mapping: CapabilityDependencyMappingModel[];
}

export interface Catalog {
    modules: VersionedModule[];
    providers?: ProviderModel[];
    aliases?: ModuleIdAlias[];
    boms: Bom[];
    metadata?: CatalogV2Metadata;
    capabilities?: CapabilityModel[];
}

