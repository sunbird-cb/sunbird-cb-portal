import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
//import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EventService } from '@sunbird-cb/utils/src/public-api'
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete, MatChipInputEvent } from '@angular/material'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { UserAutocompleteService } from '../user-autocomplete/user-autocomplete.service'

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
  filteredFruits: Observable<string[]> | undefined
  fruits:any[] = []
  allUsers:any[] = []
  apiResponse: any


  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete | undefined;

  constructor(
    public dialogRef: MatDialogRef<ContentSharingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
    private userAutoComplete: UserAutocompleteService,
  ) {
    this.shareForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })

    this.userAutoComplete.searchUser('', data.orgID).subscribe(data => {
      this.apiResponse = data.result.response.content
      let name = ''
      this.apiResponse.forEach((data: any) => {
        data.firstName.split(" ").forEach((d: any) => {
          name = name + d.substr(0,1).toUpperCase()
        })
        this.allUsers.push(
          {maskedEmail: data.maskedEmail, id: data.identifier, name: data.firstName, iconText: name}
        )
      })
    })

    this.filteredFruits = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allUsers.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (this.matAutocomplete && !this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      debugger
      // this.allUsers.filter((data: any) => {
      //   return data.name === value
      // })

      if ((value || '').trim()) {
        this.fruits.push(value.trim())
      }

      if (input) {
        input.value = ''
      }

      this.userCtrl.setValue(null)
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("event.option.viewValue ", event.option.value)
    this.fruits.push(event.option.value);
    if (this.fruitInput) {
      this.fruitInput.nativeElement.value = ''
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

  submitRating() {

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
