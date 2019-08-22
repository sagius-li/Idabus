import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndexService {
  activityIndex: { [id: string]: { name: string; description: string; icon: string; def: any } } = {
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
    }
  };

  constructor() {}
}
