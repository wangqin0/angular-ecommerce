import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {State} from "../common/state";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FormOptionService {

  private countriesUrl = 'http://129.159.46.95:8080/api/countries';
  private statesUrl = 'http://129.159.46.95:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    for (let i = 0; i <= 10; i++) {
      data.push(startYear + i);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
      return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
          map(response => response._embedded.countries)
      );
  }

  getStatesByCountryCode(code: string): Observable<State[]> {
    const url = `${this.statesUrl}/search/findByCountryCode?code=${code}`;
    // console.log(`[getStatesByCountryCode] url=${url}`);
    return this.httpClient.get<GetResponseStates>(url).pipe(
        map(response => response._embedded.states)
    );
  }
}

// unwrap JSON
interface GetResponseCountries {
  _embedded: {
    countries: Country[],
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[],
  }
}
