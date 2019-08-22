import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndexService {
  activityIndex: { [id: string]: { name: string; description: string; icon: string; def: any } } = {
    CreateResource: {
      name: 'Create Resource',
      description: 'key_activityCreateResourceDes',
      icon: 'add_box',
      def: {
        actortype: 'ServiceAccount',
        description: '',
        displayname: '',
        display: true,
        isenabled: true,
        executioncondition: '',
        id: '',
        type: 'CreateResource',
        runonpreviousstatuscondition: ['Success'],
        updateresourcesentries: [],
        xpathqueries: []
      }
    },
    DeleteResource: {
      name: 'Delete Resource',
      description: 'key_activityDeleteResourceDes',
      icon: 'delete_sweep',
      def: {
        actortype: 'ServiceAccount',
        description: '',
        displayname: '',
        display: true,
        isenabled: true,
        executioncondition: '',
        id: '',
        type: 'CreateResource',
        runonpreviousstatuscondition: ['Success'],
        updateresourcesentries: [],
        xpathqueries: []
      }
    },
    ForEach: {
      name: 'For Each Loop',
      description: 'key_activityForEachDes',
      icon: 'loop',
      def: {
        description: '',
        displayname: '',
        display: true,
        isenabled: true,
        executioncondition: '',
        id: '',
        type: 'ForEach',
        runonpreviousstatuscondition: ['Success'],
        activities: [],
        continueonerror: false,
        currentitemkey: '',
        listkey: '',
        updatewhileiterating: true
      }
    },
    RestApiCall: {
      name: 'Rest API Call',
      description: 'key_activityRestApiCallDes',
      icon: 'settings_applications',
      def: {
        description: '',
        displayname: '',
        display: true,
        isenabled: true,
        executioncondition: '',
        id: '',
        type: 'RestApiCall',
        runonpreviousstatuscondition: ['Success'],
        bodyexpression: {},
        expressions: [],
        headerexpressions: [],
        method: 'GET',
        queryexpressions: [],
        urlexpression: '',
        xpathqueries: []
      }
    },
    UpdateResources: {
      name: 'Update Resource',
      description: 'key_activityUpdateResourceDes',
      icon: 'edit',
      def: {
        actortype: 'ServiceAccount',
        description: '',
        displayname: '',
        display: true,
        isenabled: true,
        executioncondition: '',
        id: '',
        type: 'UpdateResources',
        runonpreviousstatuscondition: ['Success'],
        updateresourcesentries: [],
        xpathqueries: []
      }
    }
  };

  constructor() {}
}
