import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ForceService {


  constructor(
    public _http: HttpClient
  ) { }

  public fetchForceData(): Observable<any> {
    return this._http.get('../../assets/json/marvel.json')
  }
}
