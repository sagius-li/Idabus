export class ConnectedUser {
  public baseAddress: string;
  public name: string;
  public domain: string;
  public password: string;
}

export interface AnyProperties {
  [prop: string]: any;
}

export type Resource = AnyProperties & {};

export class ResourceSet {
  public hasMoreItems: boolean;
  public totalCount: number;
  public results: Resource[];
}
