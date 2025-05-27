// src/app/services/matchmaker.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matchmaker } from '../../app/models';

@Injectable({
  providedIn: 'root'
})
export class MatchmakerService {
  private apiUrl = 'https://localhost:7012/api/MatchMaker';

  constructor(private http: HttpClient) {}

  getAllMatchmakers(): Observable<Matchmaker[]> {
    return this.http.get<Matchmaker[]>(this.apiUrl);
  }

  getMatchmakerById(id: number): Observable<Matchmaker> {
    return this.http.get<Matchmaker>(`${this.apiUrl}/${id}`);
  }

  deleteMatchmaker(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  countCandidatesByMatchmaker(matchmakerId: number): Observable<{maleCount: number, femaleCount: number}> {
    return this.http.get<{maleCount: number, femaleCount: number}>(`${this.apiUrl}/${matchmakerId}/candidates-count`);
  }
}