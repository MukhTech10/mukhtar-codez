import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Services {
  //Import API URL
  apiUrl = APP_CONSTANTS.API_BASE_URL;

  constructor(private http: HttpClient){}

  //Send Contact Details
  sendMessage(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}`, payload);
  }
}
