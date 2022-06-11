import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { MatChipInputEvent, MatDialog, MatSnackBar } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { RolesAndActivityService } from '../../services/rolesandActivities.service'
import { DialogConfirmComponent } from 'src/app/component/dialog-confirm/dialog-confirm.component'
import { Router } from '@angular/router'
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
    @ViewChild('act', { static: false }) act!: any
    @ViewChild('deleteTitleRef', { static: true })
    deleteTitleRef: ElementRef | null = null
    @ViewChild('deleteBodyRef', { static: true })
    deleteBodyRef: ElementRef | null = null
    @ViewChild('roleName', { static: true })
    roleName: ElementRef | null = null
    editRole: any
    constructor(
        private configSvc: ConfigurationsService,
        private rolesAndActivityService: RolesAndActivityService,
        private dialog: MatDialog,
        private router:Router,
        private snackBar: MatSnackBar) {
        this.updateRoles()
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
        if (!this.editRole) {
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
        } else {
            if (this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
                _.each(this.userRoles, r => {
                    if (r.name === this.editRole.name) {
                        // tslint:disable-next-line
                        r.name = this.createRole.get('roleName')!.value
                        r.activities = _.map(this.selectedActivity, a => {
                            return { name: a } as NSProfileDataV3.IRolesActivity
                        })
                    }
                })
                const reqObj = {
                    request: {
                        userId: this.configSvc.userProfile.userId,
                        profileDetails: {
                            userRoles: _.map(this.userRoles, role => {
                                return {
                                    name: role.name,
                                    activities: role.activities,
                                }
                            }) as NSProfileDataV3.IRolesAndActivities[],
                        },
                    },
                }
                this.updateDeleteRoles(reqObj)
            }
        }
    }
    updateDeleteRoles(reqObj: any) {
        this.rolesAndActivityService.createRoles(reqObj).subscribe(res => {
            if (res) {
                this.snackBar.open('updated Successfully!!')
                this.createRole.reset()
                this.selectedActivity = []
                this.configSvc.updateGlobalProfile(true)
                setTimeout(this.updateRoles, 3000)
            }
        })
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
    edit(role: NSProfileDataV3.IRolesAndActivities) {
        if (role) {
            this.editRole = role
            this.createRole.setValue({
                roleName: role.name,
                activity: role.activities,
            })
            this.selectedActivity = []
            _.each(role.activities, a => {
                this.addActivity({ input: this.act, value: a.name })
            })
            // this.selectedActivity=role.activities
            this.router.navigate(['app','setup','roles'],{ fragment: 'maindiv' })
        }
    }
    delete(role: NSProfileDataV3.IRolesAndActivities) {
        if (role) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                    title: (this.deleteTitleRef && this.deleteTitleRef.nativeElement.value) || '',
                    body: (this.deleteBodyRef && this.deleteBodyRef.nativeElement.value) || '',
                },
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result && this.configSvc.userProfile) {
                    const delIdx = _.findIndex(this.userRoles, { name: role.name })
                    this.userRoles.splice(delIdx, 1)
                    const reqObj = {
                        request: {
                            userId: this.configSvc.userProfile.userId,
                            profileDetails: {
                                userRoles: _.map(this.userRoles, rol => {
                                    return {
                                        name: rol.name,
                                        // tslint:disable-next-line:arrow-return-shorthand
                                        activities: rol.activities,
                                    }
                                }) as NSProfileDataV3.IRolesAndActivities[],
                            },
                        },
                    }
                    this.updateDeleteRoles(reqObj)
                }
            })
        }
    }
}
