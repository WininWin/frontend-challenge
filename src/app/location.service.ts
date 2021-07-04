import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, ICityInfo, IPreferredCitiesPatch, IPreferredCitiesResponse } from './location.type';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiURL = 'http://localhost:3030';

  constructor(
    private httpClient: HttpClient, 
  ) { }

  getCities(options: {
    offset?: number,
    limit?: number,
    filter?: string, 
  } = {}): Observable<ICityInfo[]> {
    
    const params = new HttpParams({fromObject: options});
    return this.httpClient.get<IApiResponse>(`${this.apiURL}/cities`, { params })
      .pipe(
        map((response: IApiResponse) => response.data)
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
