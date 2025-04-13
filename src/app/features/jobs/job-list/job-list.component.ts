import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <h2>Liste des Postes</h2>
      <button mat-raised-button color="primary" routerLink="/jobs/new" *ngIf="isCP">
        Nouveau Poste
      </button>

      <table mat-table [dataSource]="jobs" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Titre</th>
          <td mat-cell *matCellDef="let job">{{job.title}}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let job">{{job.description}}</td>
        </ng-container>

        <ng-container matColumnDef="requiredScore">
          <th mat-header-cell *matHeaderCellDef>Score Requis</th>
          <td mat-cell *matCellDef="let job">{{job.requiredScore}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let job">
            <button mat-icon-button color="primary" [routerLink]="['/jobs/edit', job.id]" *ngIf="isCP">
              <mat-icon>edit</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    table {
      width: 100%;
      margin-top: 20px;
    }
    button {
      margin-bottom: 20px;
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['title', 'description', 'requiredScore', 'actions'];
  isCP = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.mockDataService.getJobs().subscribe(
      jobs => this.jobs = jobs
    );

    this.mockDataService.getCurrentUser().subscribe(
      user => this.isCP = user.role === 'CP'
    );
  }
}
