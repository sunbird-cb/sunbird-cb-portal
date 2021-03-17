import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NsAutoComplete } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  selectedUser(user: NsAutoComplete.IUserAutoComplete) {
    this.router.navigate(['/app/person-profile', user.wid])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: user.email } })
  }

  ngOnInit() {
  }

}
