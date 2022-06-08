import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { MatChipInputEvent, MatSnackBar } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { RolesAndActivityService } from '../../services/rolesandActivities.service'

@Component({
    selector: 'ws-app-roles-and-activities',
    templateUrl: './roles-and-activities.component.html',
    styleUrls: ['./roles-and-activities.component.scss'],
    /* tslint:disable */
    host: { class: 'w-100 role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndActivitiesComponent implements OnInit, OnDestroy {
    createRole!: FormGroup
    public selectedActivity: any[] = []
    separatorKeysCodes: number[] = [ENTER, COMMA]
    userRoles: NSProfileDataV3.IRolesAndActivities[] = []
    constructor(
        private configSvc: ConfigurationsService,
        private rolesAndActivityService: RolesAndActivityService,
        private snackBar: MatSnackBar) {
        this.updateRoles()
        // [{
        //     id: '1', name: 'role1',
        //     childNodes: [{ id: '1.1', name: 'Act1', description: 'desc1' }]
        // },
        // {
        //     id: '2', name: 'role2',
        //     childNodes: [{ id: '2.1', name: 'Act2', description: 'desc2' }]
        // }]
    }
    updateRoles() {
        this.userRoles = _.get(this.configSvc.unMappedUser, 'profileDetails.userRoles') || []
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
        const role = this.createRole.get('roleName')
        if (role && role.value && this.selectedActivity.length > 0 && this.configSvc.userProfile) {
            // console.log(this.createRole.value, this.selectedActivity)
            const reqObj = {
                request: {
                    userId: this.configSvc.userProfile.userId,
                    profileDetails: {
                        userRoles: [{
                            name: role.value,
                            // tslint:disable-next-line:arrow-return-shorthand
                            activities: _.map(this.selectedActivity, a => { return { name: a } as NSProfileDataV3.IRolesActivity }),
                        }, ...this.userRoles] as NSProfileDataV3.IRolesAndActivities[],
                    },
                },
            }
            this.rolesAndActivityService.createRoles(reqObj).subscribe(res => {
                if (res) {
                    this.snackBar.open('updated Successfully!!')
                    this.userRoles.push({
                        id: role.value,
                        description: role.value,
                        name: role.value,
                        activities: _.map(this.selectedActivity, a => {
                            return { name: a } as NSProfileDataV3.IRolesActivity
                        }),
                    })
                    this.createRole.reset()
                    this.selectedActivity = []
                    this.configSvc.updateGlobalProfile(true)
                    setTimeout(this.updateRoles, 3000)
                }
            })
        } else {
            this.snackBar.open('Role and Activities both are required.')
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
