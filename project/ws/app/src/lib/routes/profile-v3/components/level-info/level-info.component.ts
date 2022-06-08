import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-level-info',
  templateUrl: './level-info.component.html',
  styleUrls: ['./level-info.component.scss'],
})
export class LevelInfoComponent implements OnInit {
  @Input() complevel!: any

  constructor() { }

  ngOnInit() {
  }

}
