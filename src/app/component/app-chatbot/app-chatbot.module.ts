import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ClickOutsideDirective } from './clickoutside.directive'
import { AppChatbotComponent } from './app-chatbot.component'
import { ChatbotService } from './chatbot.service'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import {IGotSarthiComponent} from './../igot-sarthi/igot-sarthi.component'
import { MarkdownModule } from 'ngx-markdown';
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { NonReleventFeedbackDialogModule } from '@sunbird-cb/collection/src/lib/_common/non-relevent-feedback-dialog/non-relevent-feedback-dialog.module'
import { SupportAIComponent } from './../support-ai/support-ai.component'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
@NgModule({
  declarations: [
    ClickOutsideDirective,
    AppChatbotComponent,
    IGotSarthiComponent,
    SupportAIComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    CommonModule,
    PipeDurationTransformModule,
    MarkdownModule.forRoot(),
    DragDropModule,
    NonReleventFeedbackDialogModule,
    MatTooltipModule
  ],
  exports: [AppChatbotComponent, MarkdownModule, NonReleventFeedbackDialogModule],
  providers: [ChatbotService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppChatbotModule { }
