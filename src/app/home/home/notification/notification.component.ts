import { Component, OnInit, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material'

@Component({
  selector: 'ws-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private router: Router
  ) { }

  handleRoute(): void {
    this.router.navigateByUrl('app/person-profile/me')
    this.snackBarRef.dismiss()
  }

  ngOnInit() {
  }

}
