// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ensures it's available app-wide
})
export class DataService {
  

  constructor(private http: HttpClient) {}

  getData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
