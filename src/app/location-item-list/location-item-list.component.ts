import { Component, Input, OnInit } from '@angular/core';
import { ICityInfo } from '../location.type';

@Component({
  selector: 'app-location-item-list',
  templateUrl: './location-item-list.component.html',
  styleUrls: ['./location-item-list.component.scss']
})
export class LocationItemListComponent implements OnInit {

  @Input() cities: ICityInfo[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log(this.cities);
  }

}
