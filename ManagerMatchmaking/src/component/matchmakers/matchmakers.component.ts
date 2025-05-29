// src/app/components/matchmakers/matchmakers.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchmakerService } from '../../services/Matchmaker/match-maker.service';
import { Matchmaker } from '../../app/models';
// import { isStandalone } from '@angular/core';

@Component({
    selector: 'app-matchmakers',
    standalone:true,
    imports: [CommonModule, RouterModule],
    templateUrl: './matchmakers.component.html',
    styleUrls: ['./matchmakers.component.scss']
})
export class MatchmakersComponent implements OnInit {
  matchmakers = signal<Matchmaker[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  deletingId = signal<number | null>(null);

  constructor(private matchmakerService: MatchmakerService) {}

  ngOnInit(): void {
    this.loadMatchmakers();
  }

  loadMatchmakers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.matchmakerService.getAllMatchmakers().subscribe({
      next: (data) => {
        this.matchmakers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load matchmakers. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading matchmakers:', err);
      }
    });
  }

  deleteMatchmaker(id: number): void {
    if (confirm('Are you sure you want to delete this matchmaker?')) {
      this.deletingId.set(id);
      
      this.matchmakerService.deleteMatchmaker(id).subscribe({
        next: () => {
          this.matchmakers.update(current => 
            current.filter(matchmaker => matchmaker.id !== id)
          );
          this.deletingId.set(null);
        },
        error: (err) => {
          alert('Failed to delete matchmaker. Please try again.');
          this.deletingId.set(null);
          console.error('Error deleting matchmaker:', err);
        }
      });
    }
  }

  getFullName(matchmaker: Matchmaker): string {
    return `${matchmaker.firstName} ${matchmaker.lastName}`;
  }
}