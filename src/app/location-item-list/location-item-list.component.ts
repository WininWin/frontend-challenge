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
  @Input() searchInput?: string;

  @Output() loadMoreData: EventEmitter<any> = new EventEmitter();

  @Output() onCheck: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  clickCity(city: ICityInfo) {
    city.isPreferred = !city.isPreferred;
    this.checked(city);
  }

  checked(city: ICityInfo) {
    this.onCheck.emit({
      city,
    })
  }

  scrolled() {
    this.loadMoreData.emit();
  }

}
