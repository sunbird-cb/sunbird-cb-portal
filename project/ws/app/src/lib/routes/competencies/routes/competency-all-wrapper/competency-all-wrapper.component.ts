import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
  selector: 'ws-app-competency-all-wrapper',
  templateUrl: './competency-all-wrapper.component.html',
  styleUrls: ['./competency-all-wrapper.component.scss'],

  // host: { class: 'competency__wrapper' },
})
export class CompetencyAllWrapperComponent implements OnInit {
  currentRoute = 'all'
  @HostBinding('class')
  public class = `competency_main_wrapper`
  constructor() { }

  ngOnInit() {
  }

}
