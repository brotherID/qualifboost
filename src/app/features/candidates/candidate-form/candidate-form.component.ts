import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <h2>{{isEditMode ? 'Modifier' : 'Créer'}} un Candidat</h2>
      <form [formGroup]="candidateForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="firstName" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="lastName" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Grade</mat-label>
          <mat-select formControlName="grade" required>
            <mat-option value="Junior">Junior</mat-option>
            <mat-option value="Confirmé">Confirmé</mat-option>
            <mat-option value="Senior">Senior</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>PCI</mat-label>
          <input matInput formControlName="pci" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Séniorité (années)</mat-label>
          <input matInput type="number" formControlName="seniority" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Statut Contrat</mat-label>
          <mat-select formControlName="contractStatus" required>
            <mat-option value="CDI">CDI</mat-option>
            <mat-option value="CDD">CDD</mat-option>
            <mat-option value="Freelance">Freelance</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>TJM/Salaire</mat-label>
          <input matInput type="number" formControlName="dailyRate" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Technologie Principale</mat-label>
          <mat-select formControlName="mainTechnology" required>
            <mat-option value="Java">Java</mat-option>
            <mat-option value="Angular">Angular</mat-option>
            <mat-option value="Spring">Spring</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Ville</mat-label>
          <input matInput formControlName="city" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Disponible">Disponible</mat-option>
            <mat-option value="En Mission">En Mission</mat-option>
            <mat-option value="En Cours">En Cours</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="!candidateForm.valid">
            {{isEditMode ? 'Modifier' : 'Créer'}}
          </button>
          <button mat-button type="button" routerLink="/candidates">Annuler</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
  `]
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  isEditMode = false;
  private candidateId?: number;

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.candidateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      grade: ['', Validators.required],
      pci: ['', Validators.required],
      seniority: [0, [Validators.required, Validators.min(0)]],
      contractStatus: ['', Validators.required],
      dailyRate: [0, [Validators.required, Validators.min(0)]],
      mainTechnology: ['', Validators.required],
      city: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.candidateId = parseInt(id, 10);
      this.mockDataService.getCandidates().subscribe(candidates => {
        const candidate = candidates.find(c => c.id === this.candidateId);
        if (candidate) {
          this.candidateForm.patchValue(candidate);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.candidateForm.valid) {
      const candidateData: Candidate = {
        ...this.candidateForm.value,
        id: this.candidateId || 0,
        skills: {},
        evaluations: []
      };

      if (this.isEditMode && this.candidateId) {
        this.mockDataService.updateCandidate(this.candidateId, candidateData);
      } else {
        this.mockDataService.addCandidate(candidateData);
      }

      this.router.navigate(['/candidates']);
    }
  }
}
