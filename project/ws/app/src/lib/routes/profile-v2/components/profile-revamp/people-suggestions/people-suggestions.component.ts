import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { EventService, WsEvents } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'ws-app-people-suggestions',
  templateUrl: './people-suggestions.component.html',
  styleUrls: ['./people-suggestions.component.scss']
})
export class PeopleSuggestionsComponent implements OnChanges {
  //#region (global variables)
  @Input() peopleSuggestionsList: any[] = [];
  @Input() currentUser: any = '';
  //#endregion

  constructor(
    private profileV2RevampSvc: ProfileV2RevampService,
    private snackBar: MatLegacySnackBar,
    private router: Router,
    private events: EventService,
  ) { }

  ngOnChanges(): void {
    if(this.peopleSuggestionsList && this.peopleSuggestionsList.length > 0) {
      this.peopleSuggestionsList.forEach(person => {
        person['connectionStatus'] = 'connect'
        const userName = _.get(person, 'personalDetails.firstname', '')
            if (userName) {
              if (userName.split(' ').length > 1) {
                const nameArr = userName.split(' ')
                person['nameInitials'] = nameArr[0].charAt(0) + nameArr[1].charAt(0)
              } else {
                person['nameInitials'] = userName.charAt(0)
              }
            }
      });
    }
  }

  connect(person: any): void {
    this.sendConnectionRequest(person);
  }

  sendConnectionRequest(person: any): void {
    if(person) {
      const formBody = {
        connectionId: person.id || person.identifier || person.wid,
        userIdFrom: _.get(this.currentUser, 'userId', ''),
        userNameFrom: _.get(this.currentUser, 'userId', ''),
        userDepartmentFrom: _.get(this.currentUser, 'employmentDetails.departmentName', ''),
        userIdTo: person.userId,
        userNameTo: person.id || person.identifier || person.wid,
        userDepartmentTo: person.employmentDetails ? person.employmentDetails.departmentName : '',
      }

      this.profileV2RevampSvc.connectToNetwork(formBody).subscribe({
        next: () => {
          person.connectionStatus = 'pending';
          this.openSnackbar('Connection request sent successfully');
        },
        error: () => {
          this.openSnackbar('Something went wrong while sending connection request');
        }
      });
    }
  }

  goToUserProfile(person: any) {
    const userId = person.userId || person.id || person.wid
    this.raiseTelemetry(userId)
    this.router.navigate(['/app/person-profile', (userId)], { fragment: 'profileInfo' })
  }

  raiseTelemetry(userId: string) {
    this.events.raiseInteractTelemetry(
            { // edata
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'profile-card'
      },
      {
        id: userId,
        type: 'User'
      }, // object details
      { // env
        module: WsEvents.EnumTelemetrymodules.NETWORK,
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
