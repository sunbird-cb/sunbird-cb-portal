import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})

export class SkeletonLoaderComponent implements OnInit {
  @Input('bindingClass') bindingClass: string = '';
  constructor() { }

  ngOnInit() {
  }

}
