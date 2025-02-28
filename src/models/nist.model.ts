
export interface Nist {
  number: string;
  family: string;
  title: string;
  priority: string;
  baseline_impact?: object;
  statement: object;
  supplemental_guidance?: object;
  references?: object;
  withdrawn?: object;
  base_control?: string;
  parent_control?: string;
}

export type NistWithRelations = Nist;
