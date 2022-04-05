import { Component } from '@angular/core'
import { Observable, fromEvent, merge, of } from 'rxjs'
import { mapTo } from 'rxjs/operators'

@Component({
    selector: 'app-no-connection',
    templateUrl: './no-connection.component.html',
    styleUrls: ['./no-connection.component.scss']
})
export class NoConnectionComponent {
    online$: Observable<boolean>
    display = true
    isOnline = false
    constructor() {
        this.online$ = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false))
        )
        this.networkStatus()
    }
    public networkStatus() {
        this.online$.subscribe(value => {
            this.display = true
            this.isOnline = value
            this.updateUnlineStatus()
        })
    }
    updateUnlineStatus() {
        setTimeout(() => {
            this.display = false
        }, 3000)
    }
}