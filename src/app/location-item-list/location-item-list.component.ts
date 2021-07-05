import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICityInfo } from '../location.type';

@Component({
  selector: 'app-location-item-list',
  templateUrl: './location-item-list.component.html',
  styleUrls: ['./location-item-list.component.scss']
})
export class LocationItemListComponent implements OnInit {

  @Input() cities: ICityInfo[] = [];
  @Input() isLoading = false;

  @Output() onCheck: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.cities);
  }

  checked(city: ICityInfo) {
    console.log(city);
    this.onCheck.emit({
      city,
    })
  }

}
