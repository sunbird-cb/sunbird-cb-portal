import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CkEditorComponent } from './ck-editor.component'
import { CKEditorModule } from 'ng2-ckeditor'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CKEditorService } from './ck-editor.service'
import { AccessControlService } from './services/access-control.service'
import { ApiService } from './services/api.service'
import { LoaderService } from './services/loader.service'
import { UploadService } from './services/upload.service'
import { NotificationComponent } from './components/notification/notification.component'

@NgModule({
    declarations: [CkEditorComponent, NotificationComponent],
    imports: [
        CommonModule,
        CKEditorModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        CkEditorComponent,
    ],
    providers: [CKEditorService, AccessControlService, ApiService, LoaderService, UploadService]
})
export class CkEditorModule { }
