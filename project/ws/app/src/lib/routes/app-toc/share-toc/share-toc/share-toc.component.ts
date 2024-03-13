import { Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MultilingualTranslationsService, EventService, WsEvents, ConfigurationsService } from '@sunbird-cb/utils'
import { TranslateService } from '@ngx-translate/core'
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar } from '@angular/material'
import { AppTocService } from '../../services/app-toc.service'

import {
  UserAutocompleteService,
} from '@sunbird-cb/collection'
@Component({
  selector: 'ws-app-share-toc',
  templateUrl: './share-toc.component.html',
  styleUrls: ['./share-toc.component.scss'],
})
export class ShareTocComponent implements OnInit {
   // share content
   shareForm: FormGroup | undefined
   selectable = true
   removable = true
   addOnBlur = true
   separatorKeysCodes: number[] = [ENTER]
   userCtrl = new FormControl('')
   filteredUsers: any []| undefined
   users: any[] = []
   allUsers: any[] = []
   apiResponse: any
   courseDetails: any
   userProfile: any
   maxEmailsLimit = 30
   showLoader = false
   @Input() rootOrgId: any
   @Input() content: any
   @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement> | undefined
   @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete | undefined
   @Output() resetEnableShare: any = new EventEmitter()
  constructor(private userAutoComplete: UserAutocompleteService,
              private langtranslations: MultilingualTranslationsService,
              private translate: TranslateService,
              private snackBar: MatSnackBar,
              public configSvc: ConfigurationsService,
              private tocSvc: AppTocService,
              private events: EventService) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    this.shareForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })
    this.userCtrl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.filteredUsers = []
      //this.allUsers = []
      if (res) {
        this.getUsersToShare(res)
      }
    })
  }

  ngOnInit() {
  }

  getUsersToShare(queryStr: string) {
    this.showLoader = true
    this.userAutoComplete.searchUser(queryStr, this.rootOrgId).subscribe(data => {
      if (data.result && data.result.response) {
        this.apiResponse = data.result.response.content
        let name = ''
        let pEmail = ''
        this.apiResponse.forEach((apiData: any) => {
          apiData.firstName.split(' ').forEach((d: any) => {
            name = name + d.substr(0, 1).toUpperCase()
          })
          if (apiData.profileDetails && apiData.profileDetails.personalDetails) {
            pEmail = apiData.profileDetails.personalDetails.primaryEmail
            if (!this.allUsers.filter(user => user.email.toLowerCase().includes(pEmail.toLowerCase())).length) {
              this.allUsers.push(
                {
                  maskedEmail: apiData.maskedEmail,
                  id: apiData.identifier,
                  name: apiData.firstName,
                  iconText: name,
                  email: pEmail,
                }
              )
            }
          }
        })
        this.showLoader = false
      }
      if (this.allUsers.length === 0) {
        this.filteredUsers = []
      }
      this.filteredUsers = this.filterSharedUsers(queryStr)
    })
  }

  translateLabels(label: string, type: any, subtype?: any) {
    return this.langtranslations.translateActualLabel(label, type, subtype)
  }

  add(event: MatChipInputEvent): void {
    // this.getUsersToShare(event.value)
    if (event.value && this.matAutocomplete && !this.matAutocomplete.isOpen) {
      const input = event.input
      const value = event.value
      if (this.users.length === this.maxEmailsLimit) {
        this.openSnackbar(this.translateLabels('maxLimit', 'contentSharing', ''))
        return
      }
      if (this.users.includes(value.trim())) {
        this.openSnackbar(this.translateLabels('dulicateEmail', 'contentSharing', ''))
        return
      }
      // tslint:disable-next-line: max-line-length
      const ePattern = new RegExp(/^(?!.*\.\.)(?!.*\._)(?!.*\._\.)(?!.*\.\.$)(?!.*\.$)[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/)
      if (ePattern.test(value)) {
        if ((value || '').trim()) {
          this.users.push(value.trim())
        }
        if (input) {
          input.value = ''
        }
        this.userCtrl.setValue('')
        const el: any = document.getElementsByClassName('mat-chip-list-wrapper')
        if (el != null) {
          setTimeout(() => {
            el[0].scrollTop = el[0].scrollHeight
          },         200)
        }
      } else {
        this.openSnackbar(this.translateLabels('invalidEmail', 'contentSharing', ''))
        return
      }
    }
  }

  remove(user: string): void {
    const index = this.users.indexOf(user)

    if (index >= 0) {
      this.users.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.users.length === this.maxEmailsLimit) {
      this.openSnackbar(this.translateLabels('maxLimit', 'contentSharing', ''))
      return
    }
    if (this.users.includes(event.option.value)) {
      this.openSnackbar(this.translateLabels('dulicateUser', 'contentSharing', ''))
      return
    }
    this.users.push(event.option.value)
    if (this.userInput) {
      this.userInput.nativeElement.value = ''
    }
    this.userCtrl.setValue('')
    const el: any = document.getElementsByClassName('mat-chip-list-wrapper')
    if (el != null) {
      setTimeout(() => {
        el[0].scrollTop = el[0].scrollHeight
      },         200)
    }
  }

  filterSharedUsers(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase()
      return this.allUsers.filter(user => user.name.toLowerCase().includes(filterValue))
    }
    return []
  }

  submitSharing() {
    let courseId = ''
    let courseName = ''
    let coursePosterImageUrl = ''
    let courseProvider = ''
    let primaryCategory = ''
    if (this.configSvc.userProfile) {
      courseProvider = this.configSvc.userProfile.rootOrgName || ''
    }
    if (this.content) {
        courseId = this.content.identifier,
        courseName = this.content.name,
        coursePosterImageUrl = this.content.posterImage || 'assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg',
        primaryCategory = this.content.primaryCategory
    }
    const obj = {
      request: {
        courseId,
        courseName,
        coursePosterImageUrl,
        courseProvider,
        primaryCategory,
        recipients: '',
      },
    }
    const recipients: any = []
    this.users.forEach((selectedUser: any) => {
      if (selectedUser.includes('@') && selectedUser.includes('.')) {
        recipients.push({ email: selectedUser })
      } else {
        const selectedUserObj: any = this.allUsers.filter(user => user.name === selectedUser)
        if (selectedUserObj.length) {
          recipients.push({ userId: selectedUserObj[0].id, email: selectedUserObj[0].email })
        }
      }
    })
    if (recipients.length) {
      obj.request.recipients = recipients
      this.tocSvc.shareContent(obj).subscribe(result => {
        if (result.responseCode === 'OK') {
          this.openSnackbar(this.translateLabels('success', 'contentSharing', ''))
        }
        this.users = []
        this.resetEnableShareFlag()
        this.filteredUsers = []
        this.allUsers = []
        this.userCtrl.setValue('')
      }, error => {
        // tslint:disable
        console.log(error)
        this.openSnackbar(this.translateLabels('error','contentSharing',''))
      })
    }
  }

  onClose() {
    this.resetEnableShareFlag()
    this.users = []
    this.filteredUsers = []
    this.allUsers = []
    this.userCtrl.setValue('')
    this.raiseTelemetry('shareClose')
  }

  copyToClipboard() {
    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    document.body.appendChild(textArea)
    //textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    this.openSnackbar(this.translateLabels('linkCopied','contentSharing',''))
    this.raiseTelemetry('copyToClipboard')
  }

  raiseTelemetry(subType: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subType,
        id: this.content ? this.content.identifier : '',
      },
      {
        id: this.content ? this.content.identifier : '',
        type: this.content ? this.content.primaryCategory : '',
      },
      {
        pageIdExt: `btn-${subType}`,
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      }
    )
  }
  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  resetEnableShareFlag() {
    this.resetEnableShare.emit(false);
  }
}


