
export interface OnBoardingStage {
  id?: string;
  label: string;
  secondary_label: string;
  description: string;
  position: number;
  content: string;
}

export type OnBoardingStageWithRelations = OnBoardingStage;
