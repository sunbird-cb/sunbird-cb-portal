import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { RolesAndActivityService } from '../../services/rolesandActivities.service'
import { DialogConfirmComponent } from 'src/app/component/dialog-confirm/dialog-confirm.component'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips'
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
@Component({
    selector: 'ws-app-roles-and-activities',
    templateUrl: './roles-and-activities.component.html',
    styleUrls: ['./roles-and-activities.component.scss'],
    /* tslint:disable */
    host: { class: 'w-100 role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndActivitiesComponent implements OnInit, OnDestroy {
    createRole!: UntypedFormGroup
    public selectedActivity: any[] = []
    separatorKeysCodes: number[] = [ENTER, COMMA]
    userRoles: NSProfileDataV3.IRolesAndActivities[] = []
    @ViewChild('act') act!: any
    @ViewChild('deleteTitleRef', { static: true })
    deleteTitleRef: ElementRef | null = null
    @ViewChild('deleteBodyRef', { static: true })
    deleteBodyRef: ElementRef | null = null
    @ViewChild('roleName', { static: true })
    roleName: ElementRef | null = null
    editRole: any
    orgroleselected: any
    infoIcon = false
    simpleDialog: MatDialogRef<DialogBoxComponent> | undefined
    textBoxActive = false
    disableUpdate = false
    editData = false
    displayLoader = false
    roleId: any
    constructor(
        private configSvc: ConfigurationsService,
        private rolesAndActivityService: RolesAndActivityService,
        private dialog: MatDialog,
        private router: Router,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        ) {
        this.updateRoles()
        if (localStorage.getItem('websiteLanguage')) {
            this.translate.setDefaultLang('en')
            const lang = localStorage.getItem('websiteLanguage')!
            this.translate.use(lang)
        }
    }
    updateRoles() {
        // tslint:disable-next-line:max-line-length
        this.userRoles = _.get(this.configSvc.unMappedUser, 'profileDetails.userRoles') || []
    }
    ngOnInit(): void {
        this.createRole = new UntypedFormGroup({
            roleName: new UntypedFormControl('', [Validators.required]),
            activity: new UntypedFormControl('', [Validators.required]),
        })
    }
    ngOnDestroy(): void {
    }

    create() {
        this.displayLoader = true
        if (!this.editRole || this.editRole.length === 0) {
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
                        this.displayLoader = false
                        this.snackBar.open('Updated successfully')
                        this.userRoles.push({
                            id: role.value,
                            description: role.value,
                            name: role.value,
                            activities: _.map(this.selectedActivity, a => {
                                return { name: a } as NSProfileDataV3.IRolesActivity
                            }),
                        })
                        this.createRole.reset()
                        this.createRole.markAsPristine()
                        this.createRole.markAsUntouched()
                        this.selectedActivity = []
                        this.configSvc.updateGlobalProfile(true)
                        // setTimeout(this.updateRoles, 3000)
                        const el = document.getElementById(`${this.userRoles.length - 1}`)
                        // tslint:disable-next-line:no-unused-expression
                        el ? el.scrollIntoView({ behavior: 'smooth', block: 'start' }) : false
                    }
                })

            } else {
                this.displayLoader = false
                this.snackBar.open('Role and Activities both are required.')
            }
        } else {
            if (this.userRoles && this.userRoles.length > 0 && this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
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
        this.displayLoader = true
        this.rolesAndActivityService.createRoles(reqObj).subscribe(res => {
            if (res) {
                this.displayLoader = false
                this.editData = false
                this.snackBar.open('Updated successfully')
                this.createRole.reset()
                this.editRole = []
                this.orgroleselected = []
                this.selectedActivity = []
                this.configSvc.updateGlobalProfile(true)
                // setTimeout(this.updateRoles, 3000)
                const el = document.getElementById(`${this.roleId}`)
                // tslint:disable-next-line:no-unused-expression
                el ? el.scrollIntoView({ behavior: 'smooth', block: 'start' }) : false
            }
        })
    }
    addActivity(event: MatChipInputEvent) {
        const input = event.input
        const value = event.value as unknown as NSProfileDataV3.IChipItems
        if ((value || '')) {
            this.selectedActivity.push(value)
            if (this.editData) {
                this.checkForChange(this.selectedActivity)
            }
        }

        if (input) {
            input.value = ''
        }

        if (this.createRole.get('activity')) {
            // tslint:disable-next-line: no-non-null-assertion
            this.createRole.get('activity')!.setValue(null)
        }

        this.createRole.controls['activity'].reset()
        this.createRole.controls['activity'].markAsPristine()
        this.createRole.controls['activity'].markAsUntouched()

    }

    removeActivity(interest: any) {
        const index = this.selectedActivity.indexOf(interest)
        if (index >= 0) {
            this.selectedActivity.splice(index, 1)
            if (this.editData) {
                this.checkForChange(this.selectedActivity)
            }
        }
    }

    checkForChange(activityList: any) {
        const newobj: any = []
        activityList.forEach((val: any) => {
            const reqObj = {
                name: val,
            }
            newobj.push(reqObj)
        })
        if (JSON.stringify(this.orgroleselected.activities) === JSON.stringify(newobj)) {
            this.disableUpdate = true
        } else {
            this.disableUpdate = false
        }
    }

    change(event: any) {
        if (this.orgroleselected && this.orgroleselected.name && this.orgroleselected.name !== event.target.value) {
            this.editRole.name = event.target.value
        }
    }
    edit(role: NSProfileDataV3.IRolesAndActivities, id: string) {
        if (role) {
            this.editData = true
            this.editRole = role
            this.roleId = id
            this.orgroleselected = JSON.parse(JSON.stringify(this.editRole))
            this.createRole.setValue({
                roleName: role.name,
                activity: role.activities,
            })
            // this.textBoxActive = true
            this.selectedActivity = []
            // _.each(role.activities, a => {
            //    // this.addActivity({ input: this.act, value: a.name, this.matChipInput })
            // })
            // this.selectedActivity=role.activities
            this.router.navigate(['app', 'setup', 'roles'], { fragment: 'maindiv' })
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

    openInfoDialog() {
        this.infoIcon = true
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'roles',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {
            this.infoIcon = false
        })
    }

    openActivityDialog() {
        this.infoIcon = true
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'activity',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {
            this.infoIcon = false
        })
    }
}
