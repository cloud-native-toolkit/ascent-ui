export interface User {
    email: string,
    config: {
        complianceFeatures: boolean,
        builderFeatures: boolean,
        ibmContent: boolean,
        azureContent: boolean,
        awsContent: boolean,
    }
}
