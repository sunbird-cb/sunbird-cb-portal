import { Component, Inject, OnInit } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Observable } from 'rxjs'

import { v4 as uuid } from 'uuid'
import { RequestService } from 'src/app/routes/public/public-request/request.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

export function forbiddenNamesValidatorPosition(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      const index = optionsArray.findIndex((op: any) => {
        // tslint:disable-next-line: prefer-template
        // return new RegExp('^' + op.channel + '$').test(control.channel)
        return op.name === control.value.name
      })
      return index < 0 ? { forbiddenNames: { value: control.value.name } } : null
    }
  }
}
@Component({
  selector: 'ws-app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss'],
})
export class RequestDialogComponent implements OnInit {
  requestForm!: UntypedFormGroup
  namePatern = `[a-zA-Z\\s\\']{1,32}$`
  customCharsPattern = `^[a-zA-Z0-9 \\w\-\&\(\)]*$`
  customCharsPatternOrg = `^[a-zA-Z0-9 \\w\-\&,\(\)]*$`
  confirm = false
  disableBtn = false
  requestType: any
  masterPositions!: Observable<any> | undefined
  userData: any

  // tslint:disable-next-line:max-line-length
  requestObj: {
    state: string; action: string; serviceName: string; userId: string;
    applicationId: string; actorUserId: string; deptName: string; updateFieldValues: any
  } | undefined
  formobj: { toValue: {}; fieldKey: any; description: any; firstName: any; email: any; mobile: any } | undefined
  userform: any

  constructor(
    private snackBar: MatSnackBar,
    private requestSvc: RequestService,
    private dialogRef: MatDialogRef<RequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.requestType = this.data.reqType
    this.userData = this.data

    this.requestForm = new UntypedFormGroup({
      // tslint:disable-next-line:max-line-length
      designation: new UntypedFormControl('', this.requestType === 'Position' ? [Validators.pattern(this.customCharsPattern),
      Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)] : []),
    })

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
  }

  public confirmChange() {
    this.confirm = !this.confirm
    this.requestForm.patchValue({
      confirmBox: this.confirm,
    })
  }

  submitRequest() {
    this.disableBtn = true
    const reqType = this.requestType.toLowerCase()
    const uniqueID = uuid()
    this.requestObj = {
      state: 'INITIATE',
      action: 'INITIATE',
      serviceName: reqType,
      userId: uniqueID,
      applicationId: uniqueID,
      actorUserId: uniqueID,
      deptName: 'iGOT',
      updateFieldValues: [],
    }

    if (this.requestType === 'Position') {
      this.formobj = {
        toValue: {
          position: this.requestForm.value.designation,
        },
        fieldKey: reqType,
        description: this.requestForm.value.designation,
        firstName: this.userData.name || '',
        email: this.userData.email || '',
        mobile: this.userData.mobile || '',
      }
      this.requestObj.updateFieldValues.push(this.formobj)
      this.requestSvc.createPosition(this.requestObj).subscribe(
        (_res: any) => {
          this.disableBtn = false
          this.clearForm()
          this.openSnackbar('Your designation request has been successfully submitted')
         // this.openDialog(this.requestType, _res)
          this.dialogRef.close()
        },
        (err: any) => {
          this.disableBtn = false
          if (err.error && err.error.params && err.error.params.errmsg) {
            this.openSnackbar(err.error.params.errmsg)
          } else {
            this.openSnackbar('Something went wrong, please try again later!')
          }
        }
      )
    }
  }

  clearForm() {
    this.requestForm.reset()
    Object.keys(this.requestForm.controls).forEach(control => {
      this.requestForm.controls[control].setErrors(null)
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
