import { NgModule } from '@angular/core'
import { CalendarComponent } from './calendar.component'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'

@NgModule({
  declarations: [CalendarComponent],
  imports: [MatDatepickerModule, MatNativeDateModule],
  providers: [MatDatepickerModule],
  exports: [CalendarComponent],
})
export class CalendarModule {}
