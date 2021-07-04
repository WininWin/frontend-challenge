import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['./location-item.component.scss']
})
export class LocationItemComponent implements OnInit {

  @Input() name: string = '';
  @Input() country: string = '';
  @Input() subcountry?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
