import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from './core/services/mock-data.service';
import { UserRole } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    MatRippleModule,
    FormsModule
  ],
  template: `
    <div class="app-container">
      <!-- Top Navigation Bar -->
      <mat-toolbar class="toolbar" color="primary">
        <div class="toolbar-left">
          <button mat-icon-button (click)="sidenav.toggle()" matTooltip="Toggle Menu">
            <mat-icon>menu</mat-icon>
          </button>
          <div class="logo-container">
            <span class="logo-text">QualifBoost</span>
            <div class="logo-accent"></div>
          </div>
        </div>
        
        <div class="toolbar-right">
          <button mat-icon-button matTooltip="Notifications">
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Settings">
            <mat-icon>settings</mat-icon>
          </button>
          
          <div class="role-selector">
            <mat-form-field appearance="outline">
              <mat-select [(ngModel)]="currentRole" (selectionChange)="onRoleChange($event.value)" panelClass="role-select-panel">
                <mat-select-trigger>
                  <div class="role-display">
                    <mat-icon *ngIf="currentRole === 'RC'">person</mat-icon>
                    <mat-icon *ngIf="currentRole === 'RT'">code</mat-icon>
                    <mat-icon *ngIf="currentRole === 'CP'">business</mat-icon>
                    <span>{{getRoleLabel(currentRole)}}</span>
                  </div>
                </mat-select-trigger>
                <mat-option value="RC">
                  <div class="role-option">
                    <mat-icon>person</mat-icon>
                    <span>Recruteur Consultant</span>
                  </div>
                </mat-option>
                <mat-option value="RT">
                  <div class="role-option">
                    <mat-icon>code</mat-icon>
                    <span>Recruteur Technique</span>
                  </div>
                </mat-option>
                <mat-option value="CP">
                  <div class="role-option">
                    <mat-icon>business</mat-icon>
                    <span>Chef de Projet</span>
                  </div>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-toolbar>

      <!-- Sidenav and Content -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <div class="user-profile">
              <div class="user-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
              <div class="user-info">
                <h3>{{currentRole}}</h3>
                <p>{{getRoleLabel(currentRole)}}</p>
              </div>
            </div>
          </div>
          
          <mat-nav-list>
            <a mat-list-item routerLink="/candidates" routerLinkActive="active" class="nav-item">
              <div class="nav-item-content">
                <mat-icon>people</mat-icon>
                <span>Candidats</span>
              </div>
            </a>
            <a mat-list-item routerLink="/jobs" routerLinkActive="active" class="nav-item">
              <div class="nav-item-content">
                <mat-icon>work</mat-icon>
                <span>Postes</span>
              </div>
            </a>
            
            <!-- Gestion des templates (surtout pour les RT) -->
            <a mat-list-item routerLink="/templates" routerLinkActive="active" class="nav-item" *ngIf="currentRole === 'RT'">
              <div class="nav-item-content">
                <mat-icon>library_books</mat-icon>
                <span>Templates</span>
              </div>
            </a>
            
            <!-- Évaluations basées sur les templates -->
            <a mat-list-item routerLink="/template-evaluations" routerLinkActive="active" class="nav-item">
              <div class="nav-item-content">
                <mat-icon>grading</mat-icon>
                <span>Évaluations</span>
              </div>
            </a>
            
            <a mat-list-item routerLink="/evaluation" routerLinkActive="active" class="nav-item">
              <div class="nav-item-content">
                <mat-icon>assessment</mat-icon>
                <span>Évaluation simple</span>
              </div>
            </a>
            <a mat-list-item routerLink="/matching" routerLinkActive="active" class="nav-item">
              <div class="nav-item-content">
                <mat-icon>compare_arrows</mat-icon>
                <span>Matching</span>
              </div>
            </a>
            
            <!-- Gestion des technologies (uniquement pour les RT) -->
            <a mat-list-item routerLink="/technology-management" routerLinkActive="active" class="nav-item" *ngIf="currentRole === 'RT'">
              <div class="nav-item-content">
                <mat-icon>build</mat-icon>
                <span>Gestion des Technologies</span>
              </div>
            </a>
          </mat-nav-list>
          
          <div class="sidenav-footer">
            <div class="app-info">
              <span class="app-version">v1.0.0</span>
            </div>
          </div>
        </mat-sidenav>
        
        <mat-sidenav-content class="content">
          <div class="page-container fade-in">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* Toolbar Styles */
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      margin-left: 16px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .logo-accent {
      width: 32px;
      height: 3px;
      background-color: #ffeb3b;
      margin-top: 4px;
    }

    /* Role Selector Styles */
    .role-selector {
      margin-left: 16px;
    }

    .role-display, .role-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    :host ::ng-deep .role-selector .mat-mdc-form-field-infix {
      width: auto;
      min-width: 120px;
    }

    :host ::ng-deep .role-selector .mat-mdc-text-field-wrapper {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0 8px;
    }

    :host ::ng-deep .role-selector .mat-mdc-form-field-flex {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      height: 40px;
    }

    :host ::ng-deep .role-selector .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    /* Sidenav Container Styles */
    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    /* Sidenav Styles */
    .sidenav {
      width: 260px;
      background-color: #fff;
      border-right: none;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    }

    .sidenav-header {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar mat-icon {
      color: #1976d2;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .user-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #1976d2;
    }

    .user-info p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
    }

    .nav-item {
      margin: 8px 0;
      height: 48px;
      border-radius: 0;
      position: relative;
    }

    .nav-item-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-item mat-icon {
      margin-right: 0;
      color: rgba(0, 0, 0, 0.54);
    }

    .nav-item.active {
      background-color: #e3f2fd;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #1976d2;
    }

    .nav-item.active mat-icon {
      color: #1976d2;
    }

    .nav-item.active span {
      color: #1976d2;
      font-weight: 500;
    }

    .sidenav-footer {
      padding: 16px;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      background-color: #fafafa;
    }

    .app-version {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }

    /* Content Styles */
    .content {
      background-color: #f5f7fa;
      min-height: calc(100vh - 64px);
    }

    .page-container {
      padding: 24px;
      max-width: 1280px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
      .toolbar {
        padding: 0 8px;
      }

      .logo-text {
        font-size: 18px;
      }

      .toolbar-right button {
        display: none;
      }

      .sidenav {
        width: 240px;
      }

      .page-container {
        padding: 16px;
      }
    }

    @media (max-width: 576px) {
      .sidenav {
        width: 80%;
      }
    }
  `]
})
export class AppComponent {
  currentRole: UserRole = 'RC';

  constructor(private mockDataService: MockDataService) {}

  onRoleChange(role: UserRole) {
    this.mockDataService.setCurrentUser(role);
  }
  
  getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'RC':
        return 'Recruteur Consultant';
      case 'RT':
        return 'Recruteur Technique';
      case 'CP':
        return 'Chef de Projet';
      default:
        return '';
    }
  }
}
