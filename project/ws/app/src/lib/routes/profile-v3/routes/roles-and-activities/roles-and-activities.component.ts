import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { MatChipInputEvent } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'


@Component({
    selector: 'ws-app-roles-and-activities',
    templateUrl: './roles-and-activities.component.html',
    styleUrls: ['./roles-and-activities.component.scss'],
})
export class RolesAndActivitiesComponent implements OnInit, OnDestroy {
    createRole!: FormGroup
    public selectedActivity: NSProfileDataV3.IChipItems[] = []
    separatorKeysCodes: number[] = [ENTER, COMMA]
    userRoles: NSProfileDataV3.IRolesAndActivities[] = []
    constructor(private configSvc: ConfigurationsService) {
        this.userRoles = _.get(this.configSvc.unMappedUser, 'profileDetails.userRoles') ||
            [{
                id: '1', name: 'role1',
                childNodes: [{ id: '1.1', name: 'Act1', description: 'desc1' }]
            },
            {
                id: '2', name: 'role2',
                childNodes: [{ id: '2.1', name: 'Act2', description: 'desc2' }]
            }]
    }
    ngOnInit(): void {
        this.createRole = new FormGroup(
            {
                roleName: new FormControl(null, [Validators.required]),
                activity: new FormControl(null, [Validators.required]),
            })
    }
    ngOnDestroy(): void {
    }
    create() {
        if (this.createRole.get('roleName') && this.selectedActivity) {
            console.log(this.createRole.value, this.selectedActivity)
        }
    }
    addActivity(event: MatChipInputEvent) {
        const input = event.input
        const value = event.value as unknown as NSProfileDataV3.IChipItems

        if ((value || '')) {
            this.selectedActivity.push(value)
        }

        if (input) {
            input.value = ''
        }

        if (this.createRole.get('activity')) {
            // tslint:disable-next-line: no-non-null-assertion
            this.createRole.get('activity')!.setValue(null)
        }
    }

    removeActivity(interest: any) {
        const index = this.selectedActivity.indexOf(interest)
        if (index >= 0) {
            this.selectedActivity.splice(index, 1)
        }
    }
}
