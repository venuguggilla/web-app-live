import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from 'app/mock-api/common/user/data';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private _commonService: CommonService,
      private _httpClient: HttpClient,
      private _apiEndpointService: ApiEndpointService
  ) { }
    /**
     * POST generateUserAPIKey
     */
  changePassowrd(passowrdObject): Observable<any[]> {
    return this._httpClient.post<any[]>(`${this._commonService.baseUrl + this._apiEndpointService.webApp.setting.security.changesPassword}`,passowrdObject);
  }
    /**
     * Get getAllUserAPIKey
     */
     getAllUserAPIKey(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this._commonService.baseUrl +this._apiEndpointService.webApp.setting.api.getAllUserAPIKey}`);
  }

    /**
     * POST generateUserAPIKey
     */
     generateUserAPIKey(val): Observable<any[]> {
      return this._httpClient.post<any[]>(`${this._commonService.baseUrl + this._apiEndpointService.webApp.setting.api.generateUserAPIKey}`,val);
    }
    /**
     * POST generateUserAPIKey
     */
     updateUserAPIKey(val,currentName): Observable<any[]> {
      return this._httpClient.put<any[]>(`${this._commonService.baseUrl + this._apiEndpointService.webApp.setting.api.updateUserAPIKey+currentName}`,val);
    }
    /**
     * DEL deleteUserAPIKey
     */
     deleteUserAPIKey(val): Observable<any[]> {
      return this._httpClient.delete<any[]>(`${this._commonService.baseUrl + this._apiEndpointService.webApp.setting.api.deleteUserAPIKey}${val}`);
    }
}
