// src/app/services/data.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
 import userTaskJson from '../stub/tasks.json'; 

@Injectable({
  providedIn: 'root' // ensures it's available app-wide
})
export class DataService {
  
  private http: HttpClient = inject(HttpClient)
  
  getData(url: string): Observable<any> {
    if(url.includes('user-tasks')) {
      //TO-do: Remove this stub data when backend is ready
      return of(userTaskJson.tasks);
    }
    return this.http.get<any>(url);

  }

  postData(url: string, body: any, headers: any): Observable<any> {
    return this.http.post<any>(url, body);
  }
  
  putData(url: string, body: any): Observable<any> {
    return this.http.put<any>(url, body);
  }
}
