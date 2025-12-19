import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getTopEmployers(): Observable<any[]> {
    return this.http.get<any[]>('/api/dashboard/top-employers');
  }

  getTopSkills(): Observable<any[]> {
    return this.http.get<any[]>('/api/dashboard/top-skills');
  }

  getIndustryStats(): Observable<any[]> {
    return this.http.get<any[]>('/api/dashboard/industry-stats');
  }
}
