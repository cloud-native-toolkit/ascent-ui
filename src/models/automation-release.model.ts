
export interface AutomationRelease {
  id: string;
  url: string;
  tagName: string;
  name: string;
  createdAt: string;
  publishedAt: string;
  zipballUrl: string;
  body: string;
}

export type AutomationReleaseWithRelations = AutomationRelease;
