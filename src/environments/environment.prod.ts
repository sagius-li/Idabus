import { SystemType } from 'src/app/core/models/dataContract.model';

export const environment = {
  production: true,
  env: 'prod',
  version: '5.0.6',
  systems: [
    {
      name: 'Contoso Dev',
      type: SystemType.onPrem,
      description: 'l10n_contosoDevDes',
      icon: 'business',
      config: 'dev'
    },
    {
      name: 'Contoso Pro',
      type: SystemType.onPrem,
      description: 'l10n_contosoProDes',
      icon: 'business',
      config: 'prod'
    },
    {
      name: 'OCG Demo Space',
      type: SystemType.cloud,
      description: 'l10n_ocgDemoSpaceDes',
      icon: 'cloud',
      config: 'ocgdemospace'
    }
  ]
};
