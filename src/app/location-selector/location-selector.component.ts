import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { LocationService } from '../location.service';
import { ICityInfo } from '../location.type';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {

  constructor(
    private locationService: LocationService,
  ) { }

  public citiesData$ = this.locationService.citiesData$.pipe(
    map((response) => {
      return response;
    })
  );

  public cityPreferences$ = this.locationService.cityPreferences$;

  public updateFailError: string | undefined;
  public updatingQueue: boolean[] = [];
  public currnetSearchInput = "";

  public showList = true;

  ngOnInit(): void {
    this.locationService.serachCities();
    this.locationService.getAllPreferredCities();
  }

  onSearch(event: {
    searchInput: string
  }) {
    this.currnetSearchInput = event.searchInput;
    this.locationService.serachCities({
      searchInput: event.searchInput
    });
  }

  onCheck(event: {
    city: ICityInfo,
  }) {
    const city = event.city;
    this.updateFailError = undefined;
    this.updatingQueue.push(true);
    this.locationService.patchPreferenceCities(
      {
        [city.geonameid]: city.isPreferred
      }
    ).pipe(
      take(1)
    ).subscribe(() => {
      this.updatingQueue.pop();
      this.locationService.updatePreference(city);
    },
    () => {
      this.updatingQueue.pop();
      this.locationService.serachCities({
        searchInput: this.currnetSearchInput,
        updateError: true,
      });
      this.updateFailError = `Update ${city.name} (${city.subcountry && city.subcountry !== city.name ? city.subcountry : city.country}) Failed ! Try again later !`
    }
    );
  }

  loadMoreData() {
    this.locationService.getNextPage();
  }

}
