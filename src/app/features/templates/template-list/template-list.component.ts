import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
import { EvaluationTemplate } from '../../../core/models/template.model';

@Component({
  selector: 'app-template-list',
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
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  templates: EvaluationTemplate[] = [];
  filteredTemplates: EvaluationTemplate[] = [];
  searchText = '';
  displayedColumns: string[] = ['title', 'skillCount', 'createdBy', 'createdAt', 'actions'];

  constructor(
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getTemplates().subscribe(templates => {
      this.templates = templates;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredTemplates = this.templates.filter(template =>
      template.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  createTemplate(): void {
    this.router.navigate(['/templates/new']);
  }

  editTemplate(id: number): void {
    this.router.navigate(['/templates/edit', id]);
  }

  viewTemplate(id: number): void {
    this.router.navigate(['/templates/view', id]);
  }

  deleteTemplate(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      this.templateService.deleteTemplate(id);
      this.loadTemplates();
    }
  }
}
