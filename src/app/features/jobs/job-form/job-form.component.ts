import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <h2>{{isEditMode ? 'Modifier' : 'Créer'}} un Poste</h2>
      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Score Requis</mat-label>
          <input matInput type="number" formControlName="requiredScore" required>
        </mat-form-field>

        <div formArrayName="requiredSkills">
          <h3>Compétences Requises</h3>
          <div *ngFor="let skill of requiredSkills.controls; let i=index" [formGroupName]="i" class="skill-row">
            <mat-form-field appearance="fill">
              <mat-label>Technologie</mat-label>
              <mat-select formControlName="technology" required>
                <mat-option value="Java">Java</mat-option>
                <mat-option value="Angular">Angular</mat-option>
                <mat-option value="Spring">Spring</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Score Minimum</mat-label>
              <input matInput type="number" formControlName="minimumScore" required>
            </mat-form-field>

            <mat-checkbox formControlName="mandatory">Obligatoire</mat-checkbox>

            <button mat-icon-button color="warn" type="button" (click)="removeSkill(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>

          <button mat-stroked-button type="button" (click)="addSkill()">
            Ajouter une compétence
          </button>
        </div>

        <mat-form-field appearance="fill">
          <mat-label>Lien GitHub</mat-label>
          <input matInput formControlName="githubUrl">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Commentaire</mat-label>
          <textarea matInput formControlName="comment" rows="3"></textarea>
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="!jobForm.valid">
            {{isEditMode ? 'Modifier' : 'Créer'}}
          </button>
          <button mat-button type="button" routerLink="/jobs">Annuler</button>
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
    .skill-row {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }
    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 20px;
    }
  `]
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  private jobId?: number;

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requiredScore: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      requiredSkills: this.fb.array([]),
      githubUrl: [''],
      comment: ['']
    });
  }

  get requiredSkills() {
    return this.jobForm.get('requiredSkills') as FormArray;
  }

  addSkill() {
    const skillForm = this.fb.group({
      technology: ['', Validators.required],
      minimumScore: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      mandatory: [false]
    });

    this.requiredSkills.push(skillForm);
  }

  removeSkill(index: number) {
    this.requiredSkills.removeAt(index);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = parseInt(id, 10);
      this.mockDataService.getJobs().subscribe(jobs => {
        const job = jobs.find(j => j.id === this.jobId);
        if (job) {
          this.jobForm.patchValue({
            title: job.title,
            description: job.description,
            requiredScore: job.requiredScore,
            githubUrl: job.githubUrl,
            comment: job.comment
          });

          job.requiredSkills.forEach(skill => {
            this.requiredSkills.push(this.fb.group({
              technology: [skill.technology, Validators.required],
              minimumScore: [skill.minimumScore, [Validators.required, Validators.min(0), Validators.max(5)]],
              mandatory: [skill.mandatory]
            }));
          });
        }
      });
    } else {
      this.addSkill(); // Add one empty skill by default
    }
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobData: Job = {
        ...this.jobForm.value,
        id: this.jobId || 0
      };

      if (this.isEditMode && this.jobId) {
        this.mockDataService.updateJob(this.jobId, jobData);
      } else {
        this.mockDataService.addJob(jobData);
      }

      this.router.navigate(['/jobs']);
    }
  }
}
