import { Routes } from '@angular/router';
import { CandidateListComponent } from './features/candidates/candidate-list/candidate-list.component';
import { CandidateFormComponent } from './features/candidates/candidate-form/candidate-form.component';
import { CandidateDetailComponent } from './features/candidates/candidate-detail/candidate-detail.component';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { JobFormComponent } from './features/jobs/job-form/job-form.component';
import { MatchingComponent } from './features/matching/matching.component';
import { EvaluationComponent } from './features/evaluation/evaluation.component';

// Import des nouveaux composants pour les templates
import { TemplateListComponent } from './features/templates/template-list/template-list.component';
import { TemplateFormComponent } from './features/templates/template-form/template-form.component';
import { TemplateEvaluationComponent } from './features/templates/template-evaluation/template-evaluation.component';
import { TemplateEvaluationFormComponent } from './features/templates/template-evaluation-form/template-evaluation-form.component';

// Import du composant de gestion des technologies
import { TechnologyManagementComponent } from './features/technology-management/technology-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'candidates', pathMatch: 'full' },
  { path: 'candidates', component: CandidateListComponent },
  { path: 'candidates/new', component: CandidateFormComponent },
  { path: 'candidates/edit/:id', component: CandidateFormComponent },
  { path: 'candidates/:id', component: CandidateDetailComponent }, 
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/new', component: JobFormComponent },
  { path: 'jobs/edit/:id', component: JobFormComponent },
  { path: 'matching', component: MatchingComponent },
  { path: 'evaluation', component: EvaluationComponent },
  
  // Nouvelles routes pour les templates
  { path: 'templates', component: TemplateListComponent },
  { path: 'templates/new', component: TemplateFormComponent },
  { path: 'templates/edit/:id', component: TemplateFormComponent },
  { path: 'templates/view/:id', component: TemplateFormComponent, data: { readonly: true } },
  
  // Routes pour les évaluations basées sur les templates
  { path: 'template-evaluations', component: TemplateEvaluationComponent },
  { path: 'template-evaluations/new', component: TemplateEvaluationFormComponent },
  { path: 'template-evaluations/edit/:id', component: TemplateEvaluationFormComponent },
  { path: 'candidates/:id/evaluate', component: TemplateEvaluationFormComponent },
  
  // Route pour la gestion des technologies (réservée aux RT)
  { path: 'technology-management', component: TechnologyManagementComponent },
];
