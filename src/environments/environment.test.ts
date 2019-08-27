import { SystemType } from 'src/app/core/models/dataContract.model';

export const environment = {
  production: false,
  env: 'test',
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
