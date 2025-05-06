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
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {LoginComponent} from './authentication/login/login.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {ManagementRolesComponent} from './management-roles/management-roles.component';
import {RoleViewComponent} from './management-roles/role-view/role-view.component';
import {RoleEditComponent} from './management-roles/role-edit/role-edit.component';
import {RoleAddComponent} from './management-roles/role-add/role-add.component';
import {ManagementPermissionsComponent} from './management-permissions/management-permissions.component';
import {PermissionEditComponent} from './management-permissions/permission-edit/permission-edit.component';
import {PermissionAddComponent} from './management-permissions/permission-add/permission-add.component';
import {ManagementUsersComponent} from './management-users/management-users.component';
import {UserViewComponent} from './management-users/user-view/user-view.component';
import {UserAddComponent} from './management-users/user-add/user-add.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: MainLayoutComponent,
  children: [
      { path: 'candidates', component: CandidateListComponent},
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
      { path: 'forbidden', component: ForbiddenComponent},
      { path: 'management-roles', component: ManagementRolesComponent },
      { path: 'roles/view/:id', component: RoleViewComponent },
      { path: 'roles/edit/:id', component: RoleEditComponent },
      { path: 'roles/add', component: RoleAddComponent },
      { path: 'management-permissions', component:  ManagementPermissionsComponent},
      { path: 'permissions/edit/:id', component:  PermissionEditComponent},
      { path: 'permissions/add', component:  PermissionAddComponent},
      { path: 'management-users', component:  ManagementUsersComponent},
      { path: 'users/view/:id', component:  UserViewComponent},
      { path: 'users/add', component:  UserAddComponent}

  ]
  },
  { path: '', component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]}
];
