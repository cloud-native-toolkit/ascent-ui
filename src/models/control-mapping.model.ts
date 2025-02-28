import {Controls, Goal, Profile, Services} from './index';

export interface ControlMapping {
  // id property and others
  id?: string;
  control_id?: string;
  service_id?: string;
  arch_id?: string;
  control_subsections?: string;
  compliant?: string;
  configuration?: string;
  evidence?: string;
  scc_profile?: string;
  desc?: string;
  comment?: string;
  control: Controls;
  service: Services;
  profile: Profile;
  goals: Goal[];
}
