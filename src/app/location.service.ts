import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, ICityInfo, IPreferredCitiesPatch, IPreferredCitiesResponse } from './location.type';
import { map, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

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
    loading: boolean,
    error?: string;
  }>({
    data: [],
    loading: false
  });

  public citiesData$ = this.citiesData.asObservable();

  private cityPreferences = new BehaviorSubject<number[]>([]);

  public cityPreferences$ = this.cityPreferences.asObservable();

  constructor(
    private httpClient: HttpClient, 
  ) { }

  serachCities(searchInput: string = '') {
    this.citiesData.next({
      data: [],
      loading: true,
    });
    this.getCities({
      filter: searchInput,
      offset: this.offset,
      limit: this.limit,
    }).pipe(
      take(1)
    ).subscribe(
      (response) => {
        this.citiesData.next({
          data: response.data,
          next: response.links?.next,
          loading: false,
        });
      },
      (_error) => {
        this.citiesData.next({
          data: [],
          loading: false,
          error: 'There is an error on server. Please try again.'
        });
      }
    )
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
