import 'jest-preset-angular/setup-jest'
Object.defineProperty(window, 'env', {
    value: {
      sitePath: 'http://example.com',
      karmYogiPath: 'http://karmyogi.example.com',
      portalRoles: 'admin,user',
      name: 'Test Environment',
      cbpProvidersRoles: [],
      userBucket: 'test-bucket',
      departments: ['HR', 'Finance'],
      contentHost: 'http://content.example.com',
      azureBucket: 'test-azure-bucket',
      spvPath: 'http://spv.example.com',
      connectionType: 'online',
      KCMframeworkName: 'Framework 1',
    },
    writable: true,
  })