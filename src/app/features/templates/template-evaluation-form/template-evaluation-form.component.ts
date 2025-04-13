import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { TemplateService } from '../../../core/services/template.service';
import { TechnologyService } from '../../../core/services/technology.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EvaluationTemplate, TemplateEvaluation, TemplateSkill } from '../../../core/models/template.model';
import { Candidate } from '../../../core/models/candidate.model';
import { Technology } from '../../../core/models/technology.model';

@Component({
  selector: 'app-template-evaluation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatDividerModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonToggleModule
  ],
  templateUrl: './template-evaluation-form.component.html',
  styleUrls: ['./template-evaluation-form.component.scss']
})
export class TemplateEvaluationFormComponent implements OnInit {
  evaluationForm!: FormGroup;
  candidates: Candidate[] = [];
  templates: EvaluationTemplate[] = [];
  selectedTemplate?: EvaluationTemplate;
  selectedCandidate?: Candidate;
  evaluationId?: number;
  isEditMode = false;
  candidateId?: number;
  scoreOptions = [1, 2, 3, 4, 5];
  subcategoryTechnologies: { [subcategoryId: number]: Technology[] } = {};
  newTechnologyName: string = '';

  // Propriétés pour l'ajout manuel de compétences
  categories: any[] = [];
  selectedCategory: number | null = null;
  selectedSubcategory: number | null = null;
  selectedTechnology: number | null = null;
  manualSkillType: 'technology' | 'subcategory' = 'technology';
  subcategoriesOfSelectedCategory: any[] = [];
  technologiesOfSelectedSubcategory: any[] = [];
  newManualTechnologyName: string = '';

  get skillEvaluations(): FormArray {
    return this.evaluationForm.get('skillEvaluations') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private technologyService: TechnologyService,
    private mockDataService: MockDataService
  ) { }

  ngOnInit(): void {
    this.loadCandidates();
    this.loadTemplates();
    this.loadCategories(); // Charger les catégories pour l'ajout manuel
    this.initForm();

    // Récupérer l'ID de l'évaluation s'il existe (mode édition)
    this.route.paramMap.subscribe(params => {
      const evalId = params.get('id');
      const candId = params.get('id'); // Pour la route /candidates/:id/evaluate

      if (evalId && this.router.url.includes('/template-evaluations/edit/')) {
        // Mode édition d'une évaluation existante
        this.evaluationId = +evalId;
        this.isEditMode = true;
        this.loadEvaluation(this.evaluationId);
      } else if (candId && this.router.url.includes('/candidates/')) {
        // Mode nouvelle évaluation pour un candidat spécifique
        this.candidateId = +candId;
        this.evaluationForm.patchValue({ candidateId: this.candidateId });
        this.onCandidateChange();
      }
    });
  }

  initForm(): void {
    this.evaluationForm = this.fb.group({
      candidateId: ['', Validators.required],
      templateId: ['', Validators.required],
      evaluationDate: [new Date().toISOString().split('T')[0], Validators.required],
      skillEvaluations: this.fb.array([]),
      overallAssessment: ['', Validators.required],
      generalComments: ['']
    });
  }

  loadCandidates(): void {
    this.mockDataService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  loadTemplates(): void {
    this.templateService.getTemplates().subscribe(templates => {
      this.templates = templates;
    });
  }

  loadEvaluation(id: number): void {
    this.templateService.getTemplateEvaluation(id).subscribe(evaluation => {
      if (evaluation) {
        // Récupérer le template associé
        this.templateService.getTemplate(evaluation.templateId).subscribe(template => {
          if (template) {
            this.selectedTemplate = template;

            // Mettre à jour le formulaire avec les données de l'évaluation
            this.evaluationForm.patchValue({
              candidateId: evaluation.candidateId,
              templateId: evaluation.templateId,
              evaluationDate: new Date(evaluation.evaluationDate).toISOString().split('T')[0],
              overallAssessment: evaluation.overallAssessment,
              generalComments: evaluation.generalComments || ''
            });

            this.onCandidateChange();

            // Remplacer les évaluations des compétences
            while (this.skillEvaluations.length) {
              this.skillEvaluations.removeAt(0);
            }

            // Trouver la correspondance entre le template et les évaluations
            this.selectedTemplate.skills.forEach((templateSkill, index) => {
              const skillEval = evaluation.skillEvaluations.find(
                evaluationItem => evaluationItem.skillId === templateSkill.id
              );
              
              if (skillEval) {
                this.skillEvaluations.push(this.createSkillEvaluationGroup(templateSkill, skillEval));
              } else {
                this.skillEvaluations.push(this.createSkillEvaluationGroup(templateSkill));
              }
            });
          }
        });
      }
    });
  }

  onCandidateChange(): void {
    const candidateId = this.evaluationForm.get('candidateId')?.value;
    if (candidateId) {
      this.mockDataService.getCandidate(candidateId).subscribe(candidate => {
        this.selectedCandidate = candidate || undefined;
      });
    } else {
      this.selectedCandidate = undefined;
    }
  }

  onTemplateChange(): void {
    const templateId = this.evaluationForm.get('templateId')?.value;
    if (templateId) {
      this.templateService.getTemplate(templateId).subscribe(template => {
        this.selectedTemplate = template || undefined;

        if (this.selectedTemplate) {
          // Générer dynamiquement les champs d'évaluation des compétences
          this.generateSkillEvaluationFields();
        }
      });
    } else {
      this.selectedTemplate = undefined;

      // Vider les champs d'évaluation des compétences
      while (this.skillEvaluations.length) {
        this.skillEvaluations.removeAt(0);
      }
    }
  }

  generateSkillEvaluationFields(): void {
    if (!this.selectedTemplate) return;

    // Vider les champs d'évaluation des compétences existants
    while (this.skillEvaluations.length) {
      this.skillEvaluations.removeAt(0);
    }

    // Créer un champ pour chaque compétence du template
    this.selectedTemplate.skills.forEach(skill => {
      const skillEvaluationGroup = this.createSkillEvaluationGroup(skill);
      this.skillEvaluations.push(skillEvaluationGroup);
      if (skill.type === 'subcategory') {
        this.loadSubcategoryTechnologies(skill.itemId);
      }
    });
  }

  createSkillEvaluationGroup(templateSkill: TemplateSkill, existingEval?: any): FormGroup {
    const skillName = this.templateService.getSkillName(templateSkill.type, templateSkill.itemId);
    
    const formGroup = this.fb.group({
      skillId: [templateSkill.id],
      skillType: [templateSkill.type],
      skillName: [skillName],
      score: [existingEval?.score || 1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [existingEval?.comment || '']
    });
    
    // Ajouter le contrôle pour les technologies sélectionnées si c'est une sous-catégorie
    if (templateSkill.type === 'subcategory') {
      // Utiliser l'untyped FormBuilder pour éviter les problèmes de typage
      const untypedFormGroup = formGroup as any;
      untypedFormGroup.addControl('selectedTechnologies', this.fb.array(
        existingEval?.selectedTechnologies ? 
        existingEval.selectedTechnologies.map((tech: any) => this.createTechnologyControl(tech)) : 
        []
      ));
    }
    
    return formGroup;
  }

  // Créer un FormGroup pour une technologie
  createTechnologyControl(tech?: any): FormGroup {
    return this.fb.group({
      id: [tech?.id || -1],
      name: [tech?.name || ''],
      isNew: [tech?.isNew || false]
    });
  }

  // Charger les technologies d'une sous-catégorie
  loadSubcategoryTechnologies(subcategoryId: number): void {
    if (!subcategoryId) return;
    
    if (!this.subcategoryTechnologies[subcategoryId]) {
      this.subcategoryTechnologies[subcategoryId] = 
        this.technologyService.getTechnologiesBySubcategoryId(subcategoryId);
    }
  }

  // Obtenir le FormArray des technologies sélectionnées pour un index de compétence
  getSelectedTechnologies(index: number): FormArray {
    const control = this.skillEvaluations.at(index).get('selectedTechnologies');
    return control as FormArray || this.fb.array([]);
  }

  // Vérifier si une technologie est sélectionnée
  isTechnologySelected(skillIndex: number, technologyId: number): boolean {
    const selectedTechs = this.getSelectedTechnologies(skillIndex);
    return selectedTechs.controls.some(control => control.get('id')?.value === technologyId);
  }

  // Sélectionner/désélectionner une technologie existante
  toggleTechnology(skillIndex: number, technology: Technology): void {
    const selectedTechs = this.getSelectedTechnologies(skillIndex);
    const techIndex = selectedTechs.controls.findIndex(
      control => control.get('id')?.value === technology.id
    );

    if (techIndex === -1) {
      // Ajouter la technologie si elle n'est pas déjà sélectionnée
      selectedTechs.push(this.createTechnologyControl({
        id: technology.id,
        name: technology.name,
        isNew: false
      }));
    } else {
      // Supprimer la technologie si elle est déjà sélectionnée
      selectedTechs.removeAt(techIndex);
    }
  }

  // Ajouter une nouvelle technologie personnalisée
  addNewTechnology(skillIndex: number, subcategoryId: number, techName: string): void {
    if (!techName.trim()) return;

    const selectedTechs = this.getSelectedTechnologies(skillIndex);

    // Vérifier si cette technologie existe déjà ou est déjà dans la liste
    const existingTech = this.subcategoryTechnologies[subcategoryId].find(
      t => t.name.toLowerCase() === techName.toLowerCase()
    );

    if (existingTech) {
      // Si la technologie existe déjà dans la liste des technologies disponibles
      if (!this.isTechnologySelected(skillIndex, existingTech.id)) {
        selectedTechs.push(this.createTechnologyControl({
          id: existingTech.id,
          name: existingTech.name,
          isNew: false
        }));
      }
    } else {
      // Ajouter comme nouvelle technologie personnalisée
      selectedTechs.push(this.createTechnologyControl({
        id: -1, // ID temporaire négatif pour les nouvelles technologies
        name: techName,
        isNew: true
      }));
    }

    // Réinitialiser le champ de saisie
    this.newTechnologyName = '';
  }

  // Supprimer une technologie de la liste des sélectionnées
  removeTechnology(skillIndex: number, techIndex: number): void {
    const selectedTechs = this.getSelectedTechnologies(skillIndex);
    selectedTechs.removeAt(techIndex);
  }

  saveEvaluation(): void {
    if (this.evaluationForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const formValue = this.evaluationForm.value;

    const evaluationData = {
      candidateId: formValue.candidateId,
      templateId: formValue.templateId,
      evaluationDate: new Date(formValue.evaluationDate),
      skillEvaluations: formValue.skillEvaluations,
      overallAssessment: formValue.overallAssessment,
      generalComments: formValue.generalComments,
      evaluatedBy: 'RT' // à remplacer par l'utilisateur connecté
    };

    if (this.isEditMode && this.evaluationId) {
      // Mettre à jour une évaluation existante
      this.templateService.updateTemplateEvaluation(this.evaluationId, evaluationData);
    } else {
      // Créer une nouvelle évaluation
      this.templateService.addTemplateEvaluation(evaluationData);
    }

    this.router.navigate(['/template-evaluations']);
  }

  cancel(): void {
    this.router.navigate(['/template-evaluations']);
  }

  getSkillTypeLabel(type?: string): string {
    if (type === 'technology') return 'Technologie';
    if (type === 'subcategory') return 'Sous-catégorie';
    return 'Compétence';
  }

  // Charger les catégories pour l'ajout manuel
  loadCategories(): void {
    this.technologyService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Quand une catégorie est sélectionnée
  onCategoryChange(): void {
    if (this.selectedCategory === null) {
      this.subcategoriesOfSelectedCategory = [];
      this.selectedSubcategory = null;
      this.technologiesOfSelectedSubcategory = [];
      this.selectedTechnology = null;
      return;
    }

    const category = this.categories.find(c => c.id === this.selectedCategory);
    if (category) {
      this.subcategoriesOfSelectedCategory = category.subcategories || [];
    } else {
      this.subcategoriesOfSelectedCategory = [];
    }
    this.selectedSubcategory = null;
    this.technologiesOfSelectedSubcategory = [];
    this.selectedTechnology = null;
  }

  // Quand une sous-catégorie est sélectionnée
  onSubcategoryChange(): void {
    if (this.selectedSubcategory === null) {
      this.technologiesOfSelectedSubcategory = [];
      this.selectedTechnology = null;
      return;
    }

    const subcategory = this.subcategoriesOfSelectedCategory.find(s => s.id === this.selectedSubcategory);
    if (subcategory) {
      this.technologiesOfSelectedSubcategory = subcategory.technologies || [];
    } else {
      this.technologiesOfSelectedSubcategory = [];
    }
    this.selectedTechnology = null;
  }

  // Ajouter manuellement une compétence au formulaire
  addManualSkill(): void {
    if (this.manualSkillType === 'subcategory' && this.selectedSubcategory) {
      // Ajouter une sous-catégorie
      const subcategory = this.subcategoriesOfSelectedCategory.find(s => s.id === this.selectedSubcategory);
      if (subcategory) {
        const skillEval = this.createManualSkillEvaluation('subcategory', subcategory.id, subcategory.name);
        this.skillEvaluations.push(skillEval);
        this.loadSubcategoryTechnologies(subcategory.id);
      }
    } else if (this.manualSkillType === 'technology') {
      if (this.selectedTechnology) {
        // Ajouter une technologie existante
        const technology = this.technologiesOfSelectedSubcategory.find(t => t.id === this.selectedTechnology);
        if (technology) {
          const skillEval = this.createManualSkillEvaluation('technology', technology.id, technology.name);
          this.skillEvaluations.push(skillEval);
        }
      } else if (this.newManualTechnologyName.trim()) {
        // Ajouter une nouvelle technologie personnalisée
        const newId = -Math.floor(Math.random() * 1000) - 1; // ID temporaire négatif
        const skillEval = this.createManualSkillEvaluation('technology', newId, this.newManualTechnologyName.trim(), true);
        this.skillEvaluations.push(skillEval);
        this.newManualTechnologyName = '';
      }
    }

    // Réinitialiser les sélections
    this.selectedCategory = null;
    this.selectedSubcategory = null;
    this.selectedTechnology = null;
    this.subcategoriesOfSelectedCategory = [];
    this.technologiesOfSelectedSubcategory = [];
  }

  // Créer un nouvel élément d'évaluation de compétence manuel
  createManualSkillEvaluation(type: 'technology' | 'subcategory', itemId: number, name: string, isNew: boolean = false): FormGroup {
    const skillId = Math.floor(Math.random() * 1000000) + 1; // ID temporaire pour distinguer cette compétence ajoutée manuellement
    
    const formGroup = this.fb.group({
      skillId: [skillId],
      skillType: [type],
      skillName: [name],
      score: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [''],
      isManuallyAdded: [true], // Marquer comme ajouté manuellement
      customItemId: [itemId] // Stocker l'ID original de l'élément
    });
    
    // Si c'est une sous-catégorie, ajouter le tableau pour les technologies
    if (type === 'subcategory') {
      const untypedFormGroup = formGroup as any;
      untypedFormGroup.addControl('selectedTechnologies', this.fb.array([]));
    }
    
    return formGroup;
  }

  // Méthode de vérification pour les technologies d'une sous-catégorie
  hasTechnologiesForSubcategory(skillIndex: number): boolean {
    const skillEval = this.skillEvaluations.at(skillIndex);
    if (!skillEval) return false;
    
    const skillId = skillEval.get('skillId')?.value;
    if (!skillId) return false;
    
    return !!this.subcategoryTechnologies[skillId] && 
           Array.isArray(this.subcategoryTechnologies[skillId]) && 
           this.subcategoryTechnologies[skillId].length > 0;
  }
  
  // Obtenir les technologies d'une sous-catégorie en toute sécurité
  getTechnologiesForSubcategory(skillIndex: number): Technology[] {
    const skillEval = this.skillEvaluations.at(skillIndex);
    if (!skillEval) return [];
    
    const skillId = skillEval.get('skillId')?.value;
    if (!skillId || !this.subcategoryTechnologies[skillId]) return [];
    
    return this.subcategoryTechnologies[skillId] || [];
  }
}
