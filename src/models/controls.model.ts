import {Architectures, ControlDetails, Nist, Services} from './index';

export interface Controls {
  id: string;
  family?: string;
  name: string;
  base_control?: boolean;
  control_item?: boolean;
  parent_control?: string;
  controlDetails: ControlDetails;
  nist: Nist;
  services: Services[];
  architectures: Architectures[];
}
