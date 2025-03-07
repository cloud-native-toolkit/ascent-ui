
export interface MappingGoals {
  id?: string;
  goal_id: string;
  mapping_id: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
}

export type MappingGoalsWithRelations = MappingGoals;
