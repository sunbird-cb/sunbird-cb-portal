// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  name: (window as { [key: string]: any })['env']['name'],
  production: false,
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  organisation: (window as { [key: string]: any })['env']['organisation'] || '',
  framework: (window as { [key: string]: any })['env']['framework'] || '',
  channelId: (window as { [key: string]: any })['env']['channelId'] || '',
  azureHost: (window as { [key: string]: any })['env']['azureHost'] || '',
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  azureBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
  portals: (window as { [key: string]: any })['env']['portals'] || [],
  // mdoPortal: (window as { [key: string]: any })['env']['mdoPath'] || '',
  // spvPortal: (window as { [key: string]: any })['env']['spvPath'] || '',
  // cbcPortal: (window as { [key: string]: any })['env']['cbcPath'] || '',
  // cbpPortal: (window as { [key: string]: any })['env']['cbpPath'] || '',
  // fracPortal: (window as { [key: string]: any })['env']['fracPath'] || '',
  azureOldHost: (window as { [key: string]: any })['env']['azureOldHost'] || '',
  azureOldBuket: (window as { [key: string]: any })['env']['azureOldBuket'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '')) || [],
  recaptchaKey: (window as { [key: string]: any })['env']['recaptchaKey'] || [],
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
  certificateassets: (window as { [key: string]: any })['env']['certificateassets'] || '',
  assessmentBuffer: (window as { [key: string]: any })['env']['assessmentBuffer'] || 0,
  staticHomePageUrl: (window as { [key: string]: any })['env']['staticHomePageUrl'] || '',
  resendOTPTIme: (window as { [key: string]: any })['env']['resendOTPTIme'] || 120,
  cscmsUrl: (window as { [key: string]: any })['env']['cscmsUrl'] || '',
  dakshtaName: (window as { [key: string]: any })['env']['dakshtaName'] || '',
  contactMeetLink: (window as { [key: string]: any })['env']['contactMeetLink'] || '',
  programStripName: (window as { [key: string]: any })['env']['programStripName'] || '',
  programStripPrimaryCategory: (window as { [key: string]: any })['env']['programStripPrimaryCategory'] || '',
}
interface IEnvironment {
  name: string,
  production: boolean
  sitePath: null | string
  organisation: string
  framework: string
  channelId: string,
  azureHost: string,
  azureBucket: string,
  azureOldHost: string,
  azureOldBuket: string
  contentHost: string
  portalRoles: string[]
  // otherPortalRoles: { cbp: string[], mdo: string[], cbc: string[], frac: string[] }
  portals: [{ sr: number, id: string, name: string, desc: string, icon?: string, uriPath: string, roles: [], isPublic: boolean }],
  recaptchaKey?: string,
  contentBucket?: string,
  certificateassets?: string,
  assessmentBuffer: number,
  staticHomePageUrl: string,
  resendOTPTIme: number,
  cscmsUrl: string,
  dakshtaName: string,
  contactMeetLink: string,
  programStripName:string,
  programStripPrimaryCategory:string
}

/*
 * For easier debugging in development mode, you can import the    file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error' // Included with Angular CLI.x
