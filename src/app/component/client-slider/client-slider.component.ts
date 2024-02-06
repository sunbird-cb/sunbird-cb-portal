import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-client-slider',
  templateUrl: './client-slider.component.html',
  styleUrls: ['./client-slider.component.scss'],
})
export class ClientSliderComponent implements OnInit {
  @Input() clientList: any 
  clients: any
  // tslint:disable-next-line
  noClients = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor() { } 

  ngOnInit() {
    this.clients = this.clientList
  }
}
