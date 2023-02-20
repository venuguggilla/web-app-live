/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpointService } from '../api-endpoint.service';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public location: any;
  private httpOptions = { };
  // private httpOptions = { headers: new HttpHeaders({ 'authorization' : `Bearer ${localStorage.getItem('token')}`})};
  set locationData(location: string)
  {
      localStorage.setItem('locationData', location);
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(private http: HttpClient,private _apiEndpoint: ApiEndpointService,private _commonService: CommonService) { }

  getLocation() {
    return this.http.get(this._apiEndpoint.location,this.httpOptions).subscribe((location: any)=>{
      this.location = location;
      this.locationData = JSON.stringify(location);
    });
  }

  login(data): Observable<any> {
    return this.http.post(this._commonService.baseUrl + this._apiEndpoint.auth.login, data,this.httpOptions);
  }

  refreshToken(data): Observable<any> {
    return this.http.post(this._commonService.baseUrl + this._apiEndpoint.auth.refreshToken, data,this.httpOptions);
  }

}
