import {Architectures, Solution} from './index';

export interface UserConfig {
  complianceFeatures?: boolean,
  builderFeatures?: boolean,
  ibmContent?: boolean,
  azureContent?: boolean,
  awsContent?: boolean,
}

export interface LoggedInUser {
  email: string;
  name?: string;
  role?: string;
  roles?: string[];
  region?: string;
}

export interface BackendUser {
  email: string;
  config?: UserConfig;
  architectures: Architectures[];
  solutions: Solution[];
}

export type User = LoggedInUser & BackendUser;

export type UserWithRelations = User;

export const defaultUserConfig = (): UserConfig => ({
  complianceFeatures: false,
  builderFeatures: true,
  ibmContent: true,
  azureContent: true,
  awsContent: true,
})