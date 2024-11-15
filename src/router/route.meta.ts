export interface IRouteMeta {
  title?: string;
  menu?: string;
  icon?: string;
  anonymous?: true;
  requiresLogin?: true;
  role?: string | string[];
}
