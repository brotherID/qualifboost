import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MockDataService } from '../../../core/services/mock-data.service';
import { Candidate } from '../../../core/models/candidate.model';
import { TemplateService } from '../../../core/services/template.service';
import { TemplateEvaluation } from '../../../core/models/template.model';

@Component({
  selector: 'app-candidate-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
  candidate?: Candidate;
  candidateId?: number;
  candidateEvaluations: TemplateEvaluation[] = [];
  isLoading = true;
  skills: {name: string, level: number}[] = [];
  
  // Role variables for permission control
  isRC = false;
  isRT = false;
  isCP = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    // Get candidate ID from route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.candidateId = +id;
        this.loadCandidate();
        this.loadCandidateEvaluations();
      } else {
        this.router.navigate(['/candidates']);
      }
    });

    // Temporary role assignment - in a real app, this would come from authentication
    // or a user service
    this.isRC = this.mockDataService.getCurrentRole() === 'RC';
    this.isRT = this.mockDataService.getCurrentRole() === 'RT';
    this.isCP = this.mockDataService.getCurrentRole() === 'CP';
  }

  loadCandidate(): void {
    if (!this.candidateId) return;

    this.isLoading = true;
    this.mockDataService.getCandidate(this.candidateId).subscribe(candidate => {
      this.candidate = candidate;
      this.isLoading = false;
      
      if (this.candidate && this.candidate.skills) {
        this.skills = Object.entries(this.candidate.skills).map(([name, level]) => ({
          name,
          level: typeof level === 'number' ? level : 0
        }));
        
        // Sort skills by level (highest first)
        this.skills.sort((a, b) => b.level - a.level);
      }
    });
  }

  loadCandidateEvaluations(): void {
    if (!this.candidateId) return;

    this.templateService.getCandidateEvaluations(this.candidateId).subscribe(evaluations => {
      this.candidateEvaluations = evaluations;
    });
  }

  getSkillLevelClass(level: number): string {
    if (level >= 4) return 'skill-high';
    if (level >= 2.5) return 'skill-medium';
    return 'skill-low';
  }

  getSkillLevelLabel(level: number): string {
    if (level >= 4) return 'Expert';
    if (level >= 3) return 'Confirmé';
    if (level >= 2) return 'Intermédiaire';
    return 'Débutant';
  }

  getStatusClass(): string {
    return this.candidate?.status === 'Disponible' ? 'status-ok' : 'status-ko';
  }

  navigateToEdit(): void {
    if (this.candidateId) {
      this.router.navigate(['/candidates/edit', this.candidateId]);
    }
  }

  navigateToEvaluate(): void {
    if (this.candidateId) {
      this.router.navigate(['/candidates', this.candidateId, 'evaluate']);
    }
  }

  goBack(): void {
    this.router.navigate(['/candidates']);
  }
}
