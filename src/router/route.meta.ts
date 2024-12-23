export interface IRouteMeta {
  title?: string;
  menu?: string;
  icon?: string;
  anonymous?: true;
  parent?: string;
  requiresLogin?: string[] | true;
  defaultParam?: string;
}
