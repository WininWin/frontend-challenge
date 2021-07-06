import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, ICityInfo, IPreferredCitiesPatch, IPreferredCitiesResponse } from './location.type';
import { defaultIfEmpty, map, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly apiURL = 'http://localhost:3030';
  private readonly limit = 50;
  private readonly offset = 0;

  private citiesData = new BehaviorSubject<{
    data: ICityInfo[],
    next?: string,
    isLoading: boolean,
    error?: string
  }>({
    data: [],
    isLoading: false
  });

  public citiesData$ = this.citiesData.asObservable();

  private cityPreferences = new BehaviorSubject<{
    data: ICityInfo[],
    next?: string,
    isLoading: boolean,
    error?: string
  }>({
    data: [],
    isLoading: false,
  });

  public cityPreferences$ = this.cityPreferences.asObservable();

  private currentCitiesSubscription: Subscription | undefined;
  private currentPreferencesSubscription: Subscription | undefined;

  constructor(
    private httpClient: HttpClient, 
  ) { }

  serachCities(options: {
    searchInput: string,
    updateError?: boolean
  } = {
    searchInput: ''
  }) {

    const currentPreferredCitiesState = this.cityPreferences.getValue();
    const currentPreferredCities = currentPreferredCitiesState.data;

    this.citiesData.next({
      data: [],
      isLoading: true,
    });

    // cancel pending request on new searchInput
    if (this.currentCitiesSubscription) {
      this.currentCitiesSubscription.unsubscribe();
    }

    this.currentCitiesSubscription = 
      combineLatest(
      [
      this.getCities({
        filter: options.searchInput,
        offset: this.offset,
        limit: this.limit,
      }),
      options.updateError || currentPreferredCitiesState.isLoading || currentPreferredCitiesState.error 
        ? this.getPreferencesCities() 
        : of(currentPreferredCities.map((city) => city.geonameid))
    ]).pipe(
      take(1)
    ).subscribe(
      ([response, preferences]) => {
        const updatePreferences = response.data.map((city) => {
          return {
            ...city,
            isPreferred: preferences.includes(city.geonameid)
          }
        });
        this.citiesData.next({
          data: updatePreferences,
          next: response.links?.next,
          isLoading: false,
          error: undefined,
        });
      },
      (_error) => {
        this.citiesData.next({
          data: [],
          isLoading: false,
          error: 'There is an error on server. Please try again.'
        });
      }
    )
  }

  getAllPreferredCities() {
    const currentPreferredCitiesState = this.cityPreferences.getValue();
    const currentPreferredCities = currentPreferredCitiesState.data;
    this.cityPreferences.next({
      data: currentPreferredCities,
      isLoading: true,
    });

    // cancel pending request on new searchInput
    if (this.currentPreferencesSubscription) {
      this.currentPreferencesSubscription.unsubscribe();
    }

    this.currentPreferencesSubscription = this.getPreferencesCities().pipe(
      switchMap((preferences) => {
        const getDatas: Observable<ICityInfo>[] = [];
        const currIds = currentPreferredCities.map((currCity) => currCity.geonameid);
        preferences.map((id) => {
          if (!currIds.includes(id)) {
            getDatas.push(this.getCity(id));
          }
        });
        return forkJoin(getDatas).pipe(
          defaultIfEmpty([] as ICityInfo[]),
        )
      }),
      take(1)
    ).subscribe(
      ([...data]) => {
      this.cityPreferences.next({
        data: currentPreferredCities.concat(data),
        isLoading: false,
        error: undefined,
      });
    },
    (_error) => {
      this.cityPreferences.next({
        data: currentPreferredCities,
        isLoading: false,
        error: 'There is an error on server. Please try again.'
      });
    })
  }

  updatePreference(city: ICityInfo) {
    const currentPreferredCitiesState = this.cityPreferences.getValue();
    const currentPreferredCities = currentPreferredCitiesState.data;

    if (!currentPreferredCitiesState.isLoading && !currentPreferredCitiesState.error) {
      if (city.isPreferred) {
        if (!currentPreferredCities.some((currentCity) => currentCity.geonameid === city.geonameid)) {
          currentPreferredCities.push(city);
        }
        this.cityPreferences.next({
          data: currentPreferredCities,
          isLoading: false,
        });
      } else {
        this.cityPreferences.next({
          ...currentPreferredCitiesState,
          data:currentPreferredCities.filter((currentCity) => currentCity.geonameid !== city.geonameid),
          isLoading: false,
        });
      }
    } else {
      this.getAllPreferredCities();
    }
  }

  getNextPage() {
    const currentCitiesData = this.citiesData.getValue(); 

    if (currentCitiesData.next) {
      this.httpClient.get<IApiResponse>(currentCitiesData.next)
        .subscribe(
          (response) => {
            this.citiesData.next({
              data: currentCitiesData.data.concat(response.data),
              next: response.links?.next,
              isLoading: false,
              error: undefined,
            });
          },
          (_error) => {
            this.citiesData.next({
              data: currentCitiesData.data,
              next: currentCitiesData?.next,
              isLoading: false,
              error: undefined,
            });
          }
        )

    }

  }

  getCities(options: {
    offset?: number,
    limit?: number,
    filter?: string, 
  } = {}): Observable<IApiResponse> {
    
    const params = new HttpParams({fromObject: options});
    return this.httpClient.get<IApiResponse>(`${this.apiURL}/cities`, { params })
      .pipe(
        map((response: IApiResponse) => response)
      ); 

  }

  getCity(id: number):Observable<ICityInfo>  {
    return this.httpClient.get<ICityInfo>(`${this.apiURL}/cities/${id}`);
  }

  getPreferencesCities(options: {
    offset?: number,
    limit?: number,
  }={}): Observable<number[]> {
    const params = new HttpParams({fromObject: options});
    return this.httpClient.get<IPreferredCitiesResponse>(`${this.apiURL}/preferences/cities`, { params })
      .pipe(
        map((response: IPreferredCitiesResponse) => response.data)
      ); 

  }

  patchPreferenceCities(ciites: IPreferredCitiesPatch = {}) {
    return this.httpClient.patch(`${this.apiURL}/preferences/cities`, ciites);  
  }
}
