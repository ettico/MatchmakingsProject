// src/app/services/candidate/candidate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Candidate {
  id: string;
  name: string;
  age: number;
  sector: string;
  gender: 'male' | 'female';
  // Add any other properties your candidates have
  rating?: number;
  location?: string;
  education?: string;
  jobTitle?: string;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
}

export interface SectorDistribution {
  sector: string;
  count: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private baseUrl = 'https://localhost:7012/api';

  constructor(private http: HttpClient) {}

  getMaleCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/Male`);
  }

  getFemaleCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/Women`);
  }

  getAllCandidates(): Observable<Candidate[]> {
    return forkJoin([
      this.getMaleCandidates().pipe(
        map(candidates => candidates.map(c => ({ ...c, gender: 'male' as const })))
      ),
      this.getFemaleCandidates().pipe(
        map(candidates => candidates.map(c => ({ ...c, gender: 'female' as const })))
      )
    ]).pipe(
      map(([males, females]) => [...males, ...females])
    );
  }

  // Analytics methods
  getAgeDistribution(candidates: Candidate[]): AgeDistribution[] {
    // Create age ranges
    const ageRanges = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0
    };

    candidates.forEach(candidate => {
      if (candidate.age < 25) {
        ageRanges['18-24']++;
      } else if (candidate.age < 35) {
        ageRanges['25-34']++;
      } else if (candidate.age < 45) {
        ageRanges['35-44']++;
      } else if (candidate.age < 55) {
        ageRanges['45-54']++;
      } else {
        ageRanges['55+']++;
      }
    });

    return Object.entries(ageRanges).map(([ageRange, count]) => ({ ageRange, count }));
  }

  getSectorDistribution(candidates: Candidate[]): SectorDistribution[] {
    const sectors: Record<string, number> = {};

    candidates.forEach(candidate => {
      if (!sectors[candidate.sector]) {
        sectors[candidate.sector] = 0;
      }
      sectors[candidate.sector]++;
    });

    return Object.entries(sectors)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);
  }

  getGenderDistribution(candidates: Candidate[]): GenderDistribution[] {
    let maleCount = 0;
    let femaleCount = 0;

    candidates.forEach(candidate => {
      if (candidate.gender === 'male') {
        maleCount++;
      } else {
        femaleCount++;
      }
    });

    return [
      { gender: 'Male', count: maleCount },
      { gender: 'Female', count: femaleCount }
    ];
  }

  // Get candidates by rating (assuming candidates have a rating property)
  getRatingDistribution(candidates: Candidate[]): Record<number, number> {
    const ratings: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    candidates.forEach(candidate => {
      if (candidate.rating && ratings[candidate.rating] !== undefined) {
        ratings[candidate.rating]++;
      }
    });

    return ratings;
  }
}