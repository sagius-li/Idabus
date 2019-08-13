export enum AuthMode {
  basic = 'basic',
  windows = 'windows',
  azure = 'azure'
}

export class SidebarItem {
  path: string;
  title: string;
  icon: string;
  enabled: boolean;
}

export class BroadcastEvent {
  name: string;
  parameter: any;
}

export class AuthUser {
  DisplayName?: string;
  ObjectID?: string;
  AccountName?: string;
  AuthenticationMode?: AuthMode;
  AccessToken?: string;
  AccessConnection?: string;
}

export class ConnectedUser {
  public baseAddress: string;
  public name: string;
  public domain: string;
  public password: string;
}

export class BasicResource {
  public DisplayName: string;
  public ObjectID: string;
  public ObjectType: string;

  public constructor(resource: BasicResource | Resource) {
    this.DisplayName = resource.DisplayName;
    this.ObjectID = resource.ObjectID;
    this.ObjectType = resource.ObjectType;
  }
}

export class AttributeResource {
  description?: string;
  displayName?: string;
  multivalued?: boolean;
  required?: boolean;
  stringRegex?: string;
  integerMinimum?: number;
  integerMaximum?: number;
  systemName?: string;
  dataType?: string;
  permissionHint?: string;
  value?: BasicResource | object | any;
  values?: BasicResource[] | object[] | any[];
}

export interface AnyProperties {
  [prop: string]: AttributeResource | BasicResource | object | any;
}

export type Resource = AnyProperties & {};

export class ResourceSet {
  public hasMoreItems: boolean;
  public totalCount: number;
  public results: Resource[];
}

export class Activity {
  type?: string;
  id?: string;
  isenabled?: boolean;
  displayname?: string;
  description?: string;
  activities?: Array<any>;
  activity?: Activity;
  display?: boolean;
  runonpreviousstatuscondition?: Array<string>;
  actortype?: string;
  actorexpression?: string;
}
