import {Bom, User} from './index';

export interface Architectures {
  arch_id: string;
  name: string;
  short_desc: string;
  public: boolean;
  yaml: string;
  boms: Bom[];
  owners: User[];
  platform?: string;
  long_desc?: string;
  production_ready?: boolean;
}

export type ArchitecturesWithRelations = Architectures;
