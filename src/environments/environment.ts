import { SystemType } from 'src/app/core/models/dataContract.model';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'dev',
  version: '5.0.6',
  systems: [
    {
      name: 'Contoso Dev',
      type: SystemType.onPrem,
      description: 'Contoso development system',
      icon: 'business',
      config: 'dev'
    },
    {
      name: 'Contoso Pro',
      type: SystemType.onPrem,
      description: 'Contoso production system',
      icon: 'business',
      config: 'prod'
    },
    {
      name: 'OCG Demo Space',
      type: SystemType.cloud,
      description: 'OCG test and demo tanent on ocgdemospace.onmicrosoft.com',
      icon: 'cloud',
      config: 'ocgdemospace'
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
