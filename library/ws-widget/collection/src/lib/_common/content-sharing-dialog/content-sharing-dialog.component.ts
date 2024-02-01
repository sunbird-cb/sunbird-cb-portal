import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
//import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EventService } from '@sunbird-cb/utils/src/public-api'
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete, MatChipInputEvent } from '@angular/material'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { UserAutocompleteService } from '../user-autocomplete/user-autocomplete.service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@Component({
  selector: 'ws-widget-content-sharing-dialog',
  templateUrl: './content-sharing-dialog.component.html',
  styleUrls: ['./content-sharing-dialog.component.scss'],
})
export class ContentSharingDialogComponent implements OnInit {
  shareForm: FormGroup
  selectable = true
  removable = true
  addOnBlur = true
  separatorKeysCodes: number[] = [ENTER, COMMA]
  userCtrl = new FormControl()
  filteredUsers: Observable<string[]> | undefined
  users:any[] = []
  allUsers:any[] = []
  apiResponse: any
  placehoderText = "To: Add an email"
  courseDetails: any
  userProfile: any


  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete | undefined;

  constructor(
    public dialogRef: MatDialogRef<ContentSharingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
    private userAutoComplete: UserAutocompleteService,
    private appTocService: AppTocService,
  ) {
    this.shareForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })
    this.courseDetails = data.course
    this.userProfile = data.userProfile
    console.log("Course ", this.courseDetails)
    console.log("userProfile ", this.userProfile)
    this.userAutoComplete.searchUser('', data.userProfile.rootOrgId).subscribe(data => {
      this.apiResponse = data.result.response.content
      let name = ''
      this.apiResponse.forEach((data: any) => {
        data.firstName.split(" ").forEach((d: any) => {
          name = name + d.substr(0,1).toUpperCase()
        })
        this.allUsers.push(
          {
            maskedEmail: data.maskedEmail,
            id: data.identifier,
            name: data.firstName,
            iconText: name,
            email: data.profileDetails.personalDetails.primaryEmail
          }
        )
      })
    })

    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allUsers.slice()));
  }

  add(event: MatChipInputEvent): void {
    if (this.matAutocomplete && !this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.users.push(value.trim())
      }

      if (input) {
        input.value = ''
      }
      this.userCtrl.setValue(null)
    }
  }

  remove(fruit: string): void {
    const index = this.users.indexOf(fruit);

    if (index >= 0) {
      this.users.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    if (this.userInput) {
      this.userInput.nativeElement.value = ''
    }
    this.userCtrl.setValue(null)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    console.log("filterValue ", filterValue)
    return this.allUsers.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0)
  }

  test(event: any) {
    console.log(event)
  }

  ngOnInit() {

  }

  submitSharing() {
    debugger
    let obj = {
      request: {
        courseId: this.courseDetails.identifier,
        courseName: this.courseDetails.name,
        coursePosterImageUrl: this.courseDetails.posterImage,
        courseProvider: this.userProfile.rootOrgName,
        recepients: ''
      }
    }
    let recepients: any = []

    this.users.forEach((selectedUser: any) => {
      let selectedUserObj: any = this.allUsers.filter((user) => {return user.name === selectedUser})
      if (selectedUserObj.length) {
        recepients.push({userId: selectedUserObj[0].id, email: selectedUserObj[0].email})
      } else {
        recepients.push({email: selectedUser})
      }
    })
    if (recepients.length) {
      obj.request.recepients = recepients
      this.appTocService.shareContent(obj).subscribe(result => {
        console.log(" Result ", result)
      })
    }
  }

  raiseFeedbackTelemetry(feedbackForm: any) {
      this.events.raiseFeedbackTelemetry(
        {
          type: this.data.content.primaryCategory,
          subType: 'rating',
          id: this.data.content.identifier || '',
        },
        {
        id: this.data.content.identifier || '',
        version: `${this.data.content.version}${''}`,
        // tslint:disable-next-line: no-non-null-assertion
        commenttxt: feedbackForm.value.review || '',
      })
  }

  closeDialog(val: boolean) {
    this.dialogRef.close(val)
  }
}
