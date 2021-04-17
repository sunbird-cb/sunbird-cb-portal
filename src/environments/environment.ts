// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: false,
  sitePath: 'localhost_3000',
  organisation: 'igot-karmayogi',
  framework: 'igot',
  channelId: '0131397178949058560',
  azureHost: 'https://igot.blob.core.windows.net',
  azureBucket: 'content',

  azureOldHost: 'https://staas-bbs1.cloud.gov.in',
  azureOldBuket: 'igot',
}
interface IEnvironment {
  production: boolean
  sitePath: null | string
  organisation: string
  framework: string
  channelId: string,
  azureHost: string,
  azureBucket: string,
  azureOldHost: string,
  azureOldBuket: string
}

/*
 * For easier debugging in development mode, you can import the    file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error' // Included with Angular CLI.x
