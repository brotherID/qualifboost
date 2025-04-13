import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

import { TemplateService } from '../../../core/services/template.service';
import { TechnologyService } from '../../../core/services/technology.service';
import { EvaluationTemplate, TemplateSkill } from '../../../core/models/template.model';
import { TechnologyCategory, Subcategory, Technology } from '../../../core/models/technology.model';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule
  ],
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {
  templateForm!: FormGroup;
  template?: EvaluationTemplate;
  templateId?: number;
  isEditMode = false;
  isReadOnly = false;
  
  // Données pour les listes déroulantes
  categories: TechnologyCategory[] = [];
  subcategories: Subcategory[] = [];
  technologies: Technology[] = [];
  
  get skills(): FormArray {
    return this.templateForm.get('skills') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private technologyService: TechnologyService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
    
    // Vérifier si nous sommes en mode lecture seule
    this.route.data.subscribe(data => {
      this.isReadOnly = data['readonly'] || false;
    });
    
    // Récupérer l'ID du template s'il existe
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.templateId = +id;
        this.isEditMode = true;
        this.loadTemplate(this.templateId);
      }
    });
  }

  initForm(): void {
    this.templateForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      skills: this.fb.array([])
    });
    
    // Ajouter une première compétence vide
    if (!this.isEditMode) {
      this.addSkill();
    }
    
    if (this.isReadOnly) {
      this.templateForm.disable();
    }
  }

  loadCategories(): void {
    this.technologyService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadSubcategories(categoryId?: number): void {
    this.subcategories = this.technologyService.getSubcategories(categoryId);
  }

  loadTechnologies(subcategoryId?: number): void {
    this.technologies = this.technologyService.getTechnologies(subcategoryId);
  }

  loadTemplate(id: number): void {
    this.templateService.getTemplate(id).subscribe(template => {
      if (template) {
        this.template = template;
        
        // Remplir le formulaire avec les données du template
        this.templateForm.patchValue({
          title: template.title
        });
        
        // Vider puis remplir le FormArray avec les compétences existantes
        while (this.skills.length) {
          this.skills.removeAt(0);
        }
        
        template.skills.forEach(skill => {
          this.skills.push(this.createSkillFormGroup(skill));
          
          // Charger les sous-catégories et technologies pour cette compétence
          if (skill.type === 'subcategory') {
            const subcategory = this.technologyService.getSubcategoryById(skill.itemId);
            if (subcategory) {
              this.loadSubcategories(subcategory.categoryId);
            }
          } else if (skill.type === 'technology') {
            for (const category of this.categories) {
              for (const subcategory of category.subcategories) {
                if (subcategory.technologies.some(t => t.id === skill.itemId)) {
                  this.loadSubcategories(category.id);
                  this.loadTechnologies(subcategory.id);
                  break;
                }
              }
            }
          }
        });
        
        if (this.isReadOnly) {
          this.templateForm.disable();
        }
      }
    });
  }

  createSkillFormGroup(skill?: TemplateSkill): FormGroup {
    return this.fb.group({
      id: [skill?.id || this.getNextSkillId()],
      type: [skill?.type || 'technology', [Validators.required]],
      categoryId: [''],
      itemId: [skill?.itemId || '', [Validators.required]],
      comment: [skill?.comment || '']
    });
  }

  getNextSkillId(): number {
    // Attribuer un ID unique à chaque nouvelle compétence
    const existingIds = this.skills.controls.map(control => control.get('id')?.value || 0);
    return existingIds.length ? Math.max(...existingIds) + 1 : 1;
  }

  addSkill(): void {
    this.skills.push(this.createSkillFormGroup());
  }

  removeSkill(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    } else {
      alert('Le template doit contenir au moins une compétence.');
    }
  }

  onCategoryChange(index: number): void {
    const categoryId = this.skills.at(index).get('categoryId')?.value;
    if (categoryId) {
      // Charger les sous-catégories de cette catégorie
      this.loadSubcategories(categoryId);
      
      // Réinitialiser la sélection de sous-catégorie/technologie
      this.skills.at(index).get('itemId')?.setValue('');
    }
  }

  onTypeChange(index: number): void {
    // Réinitialiser la sélection d'ID quand on change de type
    this.skills.at(index).get('itemId')?.setValue('');
  }

  onSubcategoryChange(index: number): void {
    const skillType = this.skills.at(index).get('type')?.value;
    if (skillType === 'technology') {
      const subcategoryId = this.skills.at(index).get('subcategoryId')?.value;
      if (subcategoryId) {
        // Charger les technologies de cette sous-catégorie
        this.loadTechnologies(subcategoryId);
        
        // Réinitialiser la sélection de technologie
        this.skills.at(index).get('itemId')?.setValue('');
      }
    }
  }

  getSkillName(skill: any): string {
    if (!skill) return '';
    
    return this.templateService.getSkillName(skill.type, skill.itemId);
  }

  saveTemplate(): void {
    if (this.templateForm.invalid) {
      return;
    }
    
    const formData = this.templateForm.value;
    const skills: TemplateSkill[] = formData.skills.map((s: any) => ({
      id: s.id,
      type: s.type,
      itemId: s.itemId,
      comment: s.comment
    }));
    
    if (this.isEditMode && this.templateId) {
      // Mettre à jour un template existant
      this.templateService.updateTemplate(this.templateId, {
        title: formData.title,
        skills,
        updatedAt: new Date()
      });
    } else {
      // Créer un nouveau template
      this.templateService.addTemplate({
        title: formData.title,
        skills,
        createdBy: 'RT', // à remplacer par l'utilisateur connecté
        createdAt: new Date()
      });
    }
    
    this.router.navigate(['/templates']);
  }

  cancel(): void {
    this.router.navigate(['/templates']);
  }
}
