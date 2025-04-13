import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Candidate } from '../../core/models/candidate.model';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h2>Matching Candidats / Postes</h2>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="fill">
            <mat-label>Sélectionner un poste</mat-label>
            <mat-select [(ngModel)]="selectedJobId" (selectionChange)="onJobSelected()">
              <mat-option *ngFor="let job of jobs" [value]="job.id">
                {{job.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div *ngIf="selectedJob" class="job-details">
            <h3>Détails du poste</h3>
            <p><strong>Description:</strong> {{selectedJob.description}}</p>
            <p><strong>Score requis:</strong> {{selectedJob.requiredScore}}</p>
            <div class="skills-list">
              <h4>Compétences requises:</h4>
              <ul>
                <li *ngFor="let skill of selectedJob.requiredSkills">
                  {{skill.technology}} - Score min: {{skill.minimumScore}}
                  <span *ngIf="skill.mandatory">(Obligatoire)</span>
                </li>
              </ul>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="matchingCandidates.length > 0" class="matching-results">
        <h3>Candidats correspondants</h3>
        <table mat-table [dataSource]="matchingCandidates" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let candidate">
              {{candidate.firstName}} {{candidate.lastName}}
            </td>
          </ng-container>

          <ng-container matColumnDef="mainTechnology">
            <th mat-header-cell *matHeaderCellDef>Technologie Principale</th>
            <td mat-cell *matCellDef="let candidate">{{candidate.mainTechnology}}</td>
          </ng-container>

          <ng-container matColumnDef="skills">
            <th mat-header-cell *matHeaderCellDef>Compétences</th>
            <td mat-cell *matCellDef="let candidate">
              <div *ngFor="let skill of getRelevantSkills(candidate)">
                {{skill.technology}}: {{skill.score}}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let candidate">{{candidate.status}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div *ngIf="selectedJobId && matchingCandidates.length === 0" class="no-matches">
        <p>Aucun candidat ne correspond aux critères de ce poste.</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    mat-card {
      margin-bottom: 20px;
    }
    .job-details {
      margin-top: 20px;
    }
    .matching-results {
      margin-top: 20px;
    }
    table {
      width: 100%;
    }
    .no-matches {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }
    .skills-list {
      margin-top: 10px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class MatchingComponent implements OnInit {
  jobs: Job[] = [];
  selectedJobId: number | null = null;
  selectedJob: Job | null = null;
  matchingCandidates: Candidate[] = [];
  displayedColumns: string[] = ['name', 'mainTechnology', 'skills', 'status'];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.mockDataService.getJobs().subscribe(
      jobs => this.jobs = jobs
    );
  }

  onJobSelected(): void {
    if (this.selectedJobId) {
      this.selectedJob = this.jobs.find(job => job.id === this.selectedJobId) || null;
      if (this.selectedJob) {
        this.matchingCandidates = this.mockDataService.getMatchingCandidates(this.selectedJob);
      }
    } else {
      this.selectedJob = null;
      this.matchingCandidates = [];
    }
  }

  getRelevantSkills(candidate: Candidate): Array<{technology: string, score: number}> {
    if (!this.selectedJob) return [];
    
    return this.selectedJob.requiredSkills
      .map(required => ({
        technology: required.technology,
        score: ((candidate.skills || {})[required.technology] || 0)
      }))
      .filter(skill => skill.score > 0);
  }
}
