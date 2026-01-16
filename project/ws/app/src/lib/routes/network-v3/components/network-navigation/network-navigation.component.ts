import { Component, Input } from '@angular/core';
import { routesData } from '../../models/network-v3.model';

@Component({
  selector: 'ws-app-network-navigation',
  templateUrl: './network-navigation.component.html',
  styleUrls: ['./network-navigation.component.scss']
})
export class NetworkNavigationComponent {

  @Input() navigationItems: routesData[] = [];

}
