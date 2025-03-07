import {Controls} from './index';

export interface Services {
  service_id: string;
  fullname?: string;
  ibm_catalog_id?: string;
  fs_validated?: boolean;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  [prop: string]: any;

  controls: Controls[];
}
