import {Architectures, KubernetesResource, User} from './index';


export interface SolutionFileModel {
  name: string;
  type: string;
  content?: string;
  contentUrl?: string;
}

export interface SolutionVariableModel {
  name: string;
  description?: string;
  value?: string;
  alias?: string;
  required?: boolean;
  sensitive?: boolean;
}

export interface SolutionLayerModel {
  name: string;
  layer: string;
  description: string;
  version?: string;
}

export interface SolutionSpecModel {
  version: string;
  stack: SolutionLayerModel[];
  variables: SolutionVariableModel[];
  files: SolutionFileModel[];
}

export type ServerSolution = KubernetesResource<SolutionSpecModel>;

export interface BaseSolution {
  id: string;
  name: string;
  short_desc: string;
  long_desc: string;
  public: false,
  platform?: string;
  architectures?: Architectures[];
  techzone?: boolean;
}

export interface Solution extends BaseSolution {
  yaml: string;
  owners: User[];
}

export type SolutionWithRelations = Solution;
