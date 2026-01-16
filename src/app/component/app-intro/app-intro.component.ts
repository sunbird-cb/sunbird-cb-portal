import {
    AfterViewInit,
    Component,
    OnInit,
} from '@angular/core'

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { RootService } from '../root/root.service'

@Component({
    selector: 'ws-app-intro',
    templateUrl: './app-intro.component.html',
    styleUrls: ['./app-intro.component.scss'],
})

export class AppIntroComponent implements OnInit, AfterViewInit {
    // tslint:disable
    checked = false;
    constructor(
        private dialogRef: MatDialogRef<AppIntroComponent>,
        private rootSvc: RootService
        // private configSvc: ConfigurationsService,
        // private snackBar: MatSnackBar,
        // private valueSvc: ValueService,
        // @Inject(MAT_DIALOG_DATA) data: any
    ) {

    }
    // tslint:enable
    ngOnInit(): void {

    }
    ngAfterViewInit(): void {

    }
    confirmed() {
        if (this.checked) {
            this.rootSvc.setCookie('intro', 'false', 365)
        }
        this.dialogRef.close()
    }

}
