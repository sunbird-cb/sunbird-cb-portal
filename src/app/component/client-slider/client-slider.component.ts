import { Component, Input, OnInit } from '@angular/core'



@Component({
  selector: 'ws-client-slider',
  templateUrl: './client-slider.component.html',
  styleUrls: ['./client-slider.component.scss']
})
export class ClientSliderComponent implements OnInit {
  @Input() clientList: any 
  clients : any
  constructor() { }

  ngOnInit() {
    this.clients =  this.clientList
  }



}
