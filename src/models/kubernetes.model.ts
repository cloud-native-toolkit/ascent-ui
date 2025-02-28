export interface ResourceMetadata {
    name: string;
    labels?: object;
    annotations?: object;
}

export interface CustomResourceDefinition {
    apiVersion?: string;
    kind?: string;
    metadata?: ResourceMetadata;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface KubernetesResource<T = any> extends CustomResourceDefinition {
    spec: T;
}
