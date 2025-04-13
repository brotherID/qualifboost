import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    MatPaginatorModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>
          <mat-icon>people</mat-icon>
          Liste des Candidats
        </h2>
        <button mat-raised-button color="primary" routerLink="/candidates/new" *ngIf="isRC">
          <mat-icon>add</mat-icon>
          Nouveau Candidat
        </button>
      </div>
      
      <div class="card-container">
        <div class="filters-row">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="searchText" placeholder="Nom, technologie..." (keyup)="applyFilter()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <div class="filter-actions">
            <mat-form-field appearance="outline">
              <mat-label>Technologie</mat-label>
              <mat-select [(ngModel)]="selectedTechnology" (selectionChange)="applyFilter()">
                <mat-option [value]="''">Toutes</mat-option>
                <mat-option *ngFor="let tech of technologies" [value]="tech">{{tech}}</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Statut</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilter()">
                <mat-option [value]="''">Tous</mat-option>
                <mat-option value="Disponible">Disponible</mat-option>
                <mat-option value="En mission">En mission</mat-option>
              </mat-select>
            </mat-form-field>
            
            <button mat-stroked-button color="primary" (click)="resetFilters()" matTooltip="Réinitialiser les filtres" *ngIf="isFiltered">
              <mat-icon>filter_alt_off</mat-icon>
            </button>
          </div>
        </div>
        
        <div class="results-info" *ngIf="filteredCandidates.length !== candidates.length">
          <span>{{filteredCandidates.length}} sur {{candidates.length}} candidats affichés</span>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="filteredCandidates" class="mat-elevation-z0">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let candidate">
                <div class="candidate-name">
                  <a class="name" [routerLink]="['/candidates', candidate.id]">{{candidate.firstName}} {{candidate.lastName}}</a>
                </div>
              </td>
            </ng-container>

            <!-- Grade Column -->
            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Grade</th>
              <td mat-cell *matCellDef="let candidate">{{candidate.grade}}</td>
            </ng-container>

            <!-- Technology Column -->
            <ng-container matColumnDef="mainTechnology">
              <th mat-header-cell *matHeaderCellDef>Technologie</th>
              <td mat-cell *matCellDef="let candidate">
                <div class="skill-chip">{{candidate.mainTechnology}}</div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let candidate">
                <span [class]="'status-' + (candidate.status === 'Disponible' ? 'ok' : 'ko')">
                  {{candidate.status}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let candidate">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" [routerLink]="['/candidates', candidate.id]" matTooltip="Voir détails">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" [routerLink]="['/candidates/edit', candidate.id]" matTooltip="Modifier" *ngIf="isRC">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCandidate(candidate.id)" matTooltip="Supprimer" *ngIf="isRC">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <!-- Table Setup -->
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- No Data Row -->
            <tr class="mat-row no-data-row" *matNoDataRow>
              <td class="mat-cell" colspan="5">
                <div class="no-data-message">
                  <mat-icon>search_off</mat-icon>
                  <p>Aucun candidat ne correspond à vos critères</p>
                  <button mat-stroked-button color="primary" (click)="resetFilters()">
                    Réinitialiser les filtres
                  </button>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <mat-paginator 
          [length]="filteredCandidates.length"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25, 100]"
          aria-label="Sélectionner une page">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
      align-items: center;
    }
    
    .search-field {
      flex: 1;
      min-width: 250px;
    }
    
    .filter-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
    
    .filter-actions mat-form-field {
      width: 180px;
      margin-bottom: 0;
    }
    
    .results-info {
      margin-bottom: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
    
    .candidate-name {
      display: flex;
      flex-direction: column;
    }
    
    .name {
      font-weight: 500;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .no-data-row {
      height: 200px;
    }
    
    .no-data-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
      color: rgba(0, 0, 0, 0.5);
    }
    
    .no-data-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.2);
    }
    
    .no-data-message p {
      margin-bottom: 16px;
    }
    
    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-actions {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-actions mat-form-field {
        width: 100%;
      }
    }
  `]
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  displayedColumns: string[] = ['name', 'grade', 'mainTechnology', 'status', 'actions'];
  isRC = false;
  
  // Filtres
  searchText = '';
  selectedTechnology = '';
  selectedStatus = '';
  technologies: string[] = ['Java', 'JavaScript', 'Python', '.NET', 'SQL'];
  
  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadCandidates();
    
    this.mockDataService.getCurrentUser().subscribe(
      user => this.isRC = user.role === 'RC'
    );
  }

  loadCandidates() {
    this.mockDataService.getCandidates().subscribe(
      candidates => {
        this.candidates = candidates;
        this.filteredCandidates = [...candidates];
      }
    );
  }
  
  applyFilter() {
    this.filteredCandidates = this.candidates.filter(candidate => {
      const nameMatch = 
        this.searchText === '' || 
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(this.searchText.toLowerCase()) ||
        candidate.mainTechnology.toLowerCase().includes(this.searchText.toLowerCase());
      
      const techMatch = 
        this.selectedTechnology === '' || 
        candidate.mainTechnology === this.selectedTechnology;
      
      const statusMatch = 
        this.selectedStatus === '' || 
        candidate.status === this.selectedStatus;
      
      return nameMatch && techMatch && statusMatch;
    });
  }
  
  resetFilters() {
    this.searchText = '';
    this.selectedTechnology = '';
    this.selectedStatus = '';
    this.filteredCandidates = [...this.candidates];
  }
  
  get isFiltered(): boolean {
    return this.searchText !== '' || this.selectedTechnology !== '' || this.selectedStatus !== '';
  }

  deleteCandidate(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      this.mockDataService.deleteCandidate(id);
      this.loadCandidates();
    }
  }
}
