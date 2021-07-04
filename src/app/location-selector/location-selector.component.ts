import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {

  constructor(
    private locationService: LocationService,
  ) { }

  public cities$ = this.locationService.getCities({
    limit: 100,
    offset: 100,
  });

  public showList = false;

  ngOnInit(): void {

  }

  onFocus() {
    this.showList = true;
    console.log(this.showList);
  }

  onBlur() {
    this.showList = false;
  }

}
