import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'ws-app-profile-visibility-settings',
  templateUrl: './profile-visibility-settings.component.html',
  styleUrls: ['./profile-visibility-settings.component.scss']
})
export class ProfileVisibilitySettingsComponent implements OnInit {
  // Holds the selected visibility value
  selectedVisibility: 'public' | 'connections' | 'private' = 'public';
  loadingDetails = false;
  updateApiSubscription: any;

  constructor(
    private settingsService: SettingsService,
    private configSvc: ConfigurationsService,
    private snackBar: MatLegacySnackBar,
    private translateService: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) { }

  ngOnInit() {
    this.loadingDetails = true;
    this.getUserDetails();
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      this.translateService.setDefaultLang('hi')
      if (localStorage.getItem('websiteLanguage')) {
        this.translateService.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translateService.use(lang)
      }
    })
    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }
  }

  getUserDetails() {
    const userId = _.get(this.configSvc, 'userProfileV2.userId')
    this.settingsService.fetchProfile(userId).subscribe({
      next: (response) => {
        const visibilityStatus = _.get(response, 'result.response.profileDetails.profilePreference', 0);
        this.selectedVisibility = this.getMapedValues(visibilityStatus);
        this.loadingDetails = false;
      },
      error: () => {
        this.selectedVisibility = 'public';
        this.loadingDetails = false;
      }
    });
  }

  getMapedValues(value: string | number) {
    const mapedValue: any = {
      public: 0,
      private: 1,
      connections: 10,
      0: 'public',
      1: 'private',
      10: 'connections'
    }
    return mapedValue[value];
  }

  onVisibilityChange(value: 'public' | 'connections' | 'private') {
    const form = {
      request: {
        userId: _.get(this.configSvc, 'userProfileV2.userId'),
        profileDetails: {
          profilePreference: this.getMapedValues(value)
        }
      }
    }
    if (this.updateApiSubscription) {
      this.updateApiSubscription.unsubscribe();
    }
    this.updateApiSubscription = this.settingsService.updateProfileVisibility(form).subscribe({
      next: (response: any) => {
        if(response) {
          this.getUserDetails();
          this.snackBar.open('Updated Successfully')
        }
      }, error: () => { 
        this.snackBar.open('Something went wrong please try again later')
      }
    });
  }
}
