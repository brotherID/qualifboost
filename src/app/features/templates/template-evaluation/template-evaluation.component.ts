import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

import { TemplateService } from '../../../core/services/template.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TemplateEvaluation } from '../../../core/models/template.model';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-template-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './template-evaluation.component.html',
  styleUrls: ['./template-evaluation.component.scss']
})
export class TemplateEvaluationComponent implements OnInit {
  evaluations: TemplateEvaluation[] = [];
  filteredEvaluations: TemplateEvaluation[] = [];
  candidates: Candidate[] = [];
  searchText = '';
  displayedColumns: string[] = ['candidateName', 'templateName', 'evaluationDate', 'overallScore', 'actions'];

  constructor(
    private templateService: TemplateService,
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadCandidates();
  }

  loadEvaluations(): void {
    this.templateService.getTemplateEvaluations().subscribe(evaluations => {
      this.evaluations = evaluations;
      this.applyFilter();
    });
  }

  loadCandidates(): void {
    this.mockDataService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  getCandidateName(candidateId: number): string {
    const candidate = this.candidates.find(c => c.id === candidateId);
    return candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidat inconnu';
  }

  getTemplateName(templateId: number): string {
    let templateName = 'Template inconnu';
    this.templateService.getTemplate(templateId).subscribe(template => {
      if (template) {
        templateName = template.title;
      }
    });
    return templateName;
  }

  calculateOverallScore(evaluation: TemplateEvaluation): number {
    if (!evaluation.skillEvaluations.length) return 0;
    const sum = evaluation.skillEvaluations.reduce((total, skill) => total + skill.score, 0);
    return Math.round((sum / evaluation.skillEvaluations.length) * 10) / 10;
  }

  applyFilter(): void {
    this.filteredEvaluations = this.evaluations.filter(evaluation => {
      const candidateName = this.getCandidateName(evaluation.candidateId).toLowerCase();
      return candidateName.includes(this.searchText.toLowerCase());
    });
  }

  createEvaluation(): void {
    this.router.navigate(['/template-evaluations/new']);
  }

  editEvaluation(id: number): void {
    this.router.navigate(['/template-evaluations/edit', id]);
  }

  deleteEvaluation(id: number): void {
    if (confirm('u00cates-vous su00fbr de vouloir supprimer cette u00e9valuation ?')) {
      this.templateService.deleteTemplateEvaluation(id);
      this.loadEvaluations();
    }
  }

  getScoreClass(score: number): string {
    if (score >= 4) return 'score-high';
    if (score >= 2.5) return 'score-medium';
    return 'score-low';
  }
}
