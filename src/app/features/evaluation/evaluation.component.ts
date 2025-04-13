import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { Candidate } from '../../core/models/candidate.model';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <h2>Évaluation des Compétences</h2>
      
      <mat-card *ngIf="isRT">
        <mat-card-content>
          <form [formGroup]="evaluationForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Candidat</mat-label>
              <mat-select formControlName="candidateId" required>
                <mat-option *ngFor="let candidate of candidates" [value]="candidate.id">
                  {{candidate.firstName}} {{candidate.lastName}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Technologie</mat-label>
              <mat-select formControlName="technology" required>
                <mat-option value="Java">Java</mat-option>
                <mat-option value="Angular">Angular</mat-option>
                <mat-option value="Spring">Spring</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Score</mat-label>
              <input matInput type="number" formControlName="score" required min="0" max="5">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Commentaire</mat-label>
              <textarea matInput formControlName="comment" rows="4"></textarea>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!evaluationForm.valid">
                Enregistrer l'évaluation
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div *ngIf="!isRT" class="unauthorized">
        <p>Seuls les RT peuvent accéder à cette page.</p>
      </div>
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
      justify-content: flex-end;
      margin-top: 16px;
    }
    .unauthorized {
      text-align: center;
      color: red;
      margin-top: 20px;
    }
    mat-card {
      margin-top: 20px;
    }
  `]
})
export class EvaluationComponent implements OnInit {
  evaluationForm: FormGroup;
  candidates: Candidate[] = [];
  isRT = false;

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService
  ) {
    this.evaluationForm = this.fb.group({
      candidateId: ['', Validators.required],
      technology: ['', Validators.required],
      score: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mockDataService.getCandidates().subscribe(
      candidates => this.candidates = candidates
    );

    this.mockDataService.getCurrentUser().subscribe(
      user => this.isRT = user.role === 'RT'
    );
  }

  onSubmit(): void {
    if (this.evaluationForm.valid && this.isRT) {
      const formValue = this.evaluationForm.value;
      const candidate = this.candidates.find(c => c.id === formValue.candidateId);
      
      if (candidate) {
        // Mettre à jour les compétences
        if (!candidate.skills) {
          candidate.skills = {};
        }
        candidate.skills[formValue.technology] = formValue.score;
        
        // Ajouter l'évaluation
        candidate.evaluations.push({
          technology: formValue.technology,
          score: formValue.score,
          comments: formValue.comment,
          evaluatedBy: 'RT',
          evaluationDate: new Date()
        });

        this.mockDataService.updateCandidate(candidate.id, candidate);
        this.evaluationForm.reset();
      }
    }
  }
}
