import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
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

  public apiResponse$ = this.locationService.citiesData$.pipe(
    map((response) => {
      return response;
    })
  );

  public showList = true;

  ngOnInit(): void {
    this.locationService.serachCities();
  }

  onFocus() {
    this.showList = true;
  }

  onBlur() {
    this.showList = true;
  }

  onSearch(event: {
    searchInput: string
  }) {
    this.locationService.serachCities(event.searchInput);
  }

}
