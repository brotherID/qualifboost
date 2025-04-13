import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvaluationTemplate, TemplateEvaluation } from '../models/template.model';
import { MockDataService } from './mock-data.service';
import { TechnologyService } from './technology.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  // Templates pru00e9du00e9finis
  private templates: EvaluationTemplate[] = [
    {
      id: 1,
      title: 'Template Java Back-end',
      skills: [
        { id: 1, type: 'subcategory', itemId: 102, comment: 'Framework Spring' }, // Spring
        { id: 2, type: 'technology', itemId: 1005, comment: 'ORM et persistance' }, // Spring JPA
        { id: 3, type: 'technology', itemId: 1006, comment: 'Su00e9curite applicative' }, // Spring Security
        { id: 4, type: 'technology', itemId: 3004, comment: 'Conteneurisation' }, // Docker
        { id: 5, type: 'technology', itemId: 2001, comment: 'Tests unitaires' }, // JUnit
      ],
      createdBy: 'RT',
      createdAt: new Date('2025-01-15')
    },
    {
      id: 2,
      title: 'Template Full Stack JS',
      skills: [
        { id: 1, type: 'technology', itemId: 4007, comment: 'TypeScript obligatoire' }, // TypeScript
        { id: 2, type: 'technology', itemId: 4001, comment: 'Frontend Angular' }, // Angular
        { id: 3, type: 'subcategory', itemId: 402, comment: 'Backend JS' }, // Backend JS (Node.js, Express, etc.)
        { id: 4, type: 'technology', itemId: 4009, comment: 'Tests unitaires JS' }, // Jest
      ],
      createdBy: 'RT',
      createdAt: new Date('2025-02-05')
    },
    {
      id: 3,
      title: 'Template DevOps',
      skills: [
        { id: 1, type: 'subcategory', itemId: 301, comment: 'Cloud obligatoire' }, // Services Cloud
        { id: 2, type: 'subcategory', itemId: 302, comment: 'Container & Orchestration' }, // Conteneurisation
        { id: 3, type: 'subcategory', itemId: 303, comment: 'Pipeline CI/CD' }, // CI/CD
      ],
      createdBy: 'RT',
      createdAt: new Date('2025-03-10')
    }
  ];

  // u00c9valuations ru00e9alisu00e9es avec des templates
  private templateEvaluations: TemplateEvaluation[] = [
    {
      id: 1,
      candidateId: 1, // Jean Dupont
      templateId: 1, // Template Java Back-end
      evaluationDate: new Date('2025-03-15'),
      skillEvaluations: [
        { skillId: 1, skillType: 'subcategory', skillName: 'Spring', score: 4, comment: 'Bonne mau00eetrise de Spring en gu00e9nu00e9ral' },
        { skillId: 2, skillType: 'technology', skillName: 'Spring JPA', score: 3, comment: 'Connau00eet les bases mais manque de pratique sur les requ00eates complexes' },
        { skillId: 3, skillType: 'technology', skillName: 'Spring Security', score: 4, comment: 'Tru00e8s bonne compru00e9hension des concepts de su00e9curite' },
        { skillId: 4, skillType: 'technology', skillName: 'Docker', score: 3, comment: 'Sait utiliser des containers mais pas Compose' },
        { skillId: 5, skillType: 'technology', skillName: 'JUnit', score: 4, comment: 'Bon niveau de tests unitaires' },
      ],
      overallAssessment: 'Bon profil Java Backend, particuliu00e8rement pour des projets Spring Boot.',
      generalComments: 'Candidat su00e9rieux et motivu00e9, avec une bonne expu00e9rience. Recommandu00e9 pour des projets du00e9butant rapidement.',
      evaluatedBy: 'RT'
    }
  ];

  private templatesSubject = new BehaviorSubject<EvaluationTemplate[]>(this.templates);
  private evaluationsSubject = new BehaviorSubject<TemplateEvaluation[]>(this.templateEvaluations);

  constructor(
    private mockDataService: MockDataService,
    private technologyService: TechnologyService
  ) {}

  // Mu00e9thodes CRUD pour les templates
  getTemplates(): Observable<EvaluationTemplate[]> {
    return this.templatesSubject.asObservable();
  }

  getTemplate(id: number): Observable<EvaluationTemplate | undefined> {
    return new BehaviorSubject<EvaluationTemplate | undefined>(
      this.templates.find(t => t.id === id)
    ).asObservable();
  }

  addTemplate(template: Omit<EvaluationTemplate, 'id'>): void {
    const newId = this.templates.length > 0 
      ? Math.max(...this.templates.map(t => t.id)) + 1 
      : 1;
    
    const newTemplate: EvaluationTemplate = {
      ...template,
      id: newId,
      createdAt: new Date()
    };
    
    this.templates.push(newTemplate);
    this.templatesSubject.next([...this.templates]);
  }

  updateTemplate(id: number, template: Partial<EvaluationTemplate>): void {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates[index] = { 
        ...this.templates[index], 
        ...template,
        updatedAt: new Date() 
      };
      this.templatesSubject.next([...this.templates]);
    }
  }

  deleteTemplate(id: number): void {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates.splice(index, 1);
      this.templatesSubject.next([...this.templates]);
      
      // Supprimer aussi les u00e9valuations liu00e9es u00e0 ce template
      const evaluationsToRemove = this.templateEvaluations.filter(e => e.templateId === id);
      evaluationsToRemove.forEach(e => this.deleteTemplateEvaluation(e.id));
    }
  }

  // Mu00e9thodes pour les u00e9valuations basu00e9es sur des templates
  getTemplateEvaluations(): Observable<TemplateEvaluation[]> {
    return this.evaluationsSubject.asObservable();
  }

  getTemplateEvaluation(id: number): Observable<TemplateEvaluation | undefined> {
    return new BehaviorSubject<TemplateEvaluation | undefined>(
      this.templateEvaluations.find(e => e.id === id)
    ).asObservable();
  }

  getCandidateEvaluations(candidateId: number): Observable<TemplateEvaluation[]> {
    return new BehaviorSubject<TemplateEvaluation[]>(
      this.templateEvaluations.filter(e => e.candidateId === candidateId)
    ).asObservable();
  }

  addTemplateEvaluation(evaluation: Omit<TemplateEvaluation, 'id'>): void {
    const newId = this.templateEvaluations.length > 0 
      ? Math.max(...this.templateEvaluations.map(e => e.id)) + 1 
      : 1;
    
    const newEvaluation: TemplateEvaluation = {
      ...evaluation,
      id: newId
    };
    
    this.templateEvaluations.push(newEvaluation);
    this.evaluationsSubject.next([...this.templateEvaluations]);

    // Mettre u00e0 jour les compu00e9tences du candidat
    this.updateCandidateSkills(newEvaluation);
  }

  updateTemplateEvaluation(id: number, evaluation: Partial<TemplateEvaluation>): void {
    const index = this.templateEvaluations.findIndex(e => e.id === id);
    if (index !== -1) {
      this.templateEvaluations[index] = { 
        ...this.templateEvaluations[index], 
        ...evaluation 
      };
      this.evaluationsSubject.next([...this.templateEvaluations]);

      // Mettre u00e0 jour les compu00e9tences du candidat
      this.updateCandidateSkills(this.templateEvaluations[index]);
    }
  }

  deleteTemplateEvaluation(id: number): void {
    const index = this.templateEvaluations.findIndex(e => e.id === id);
    if (index !== -1) {
      this.templateEvaluations.splice(index, 1);
      this.evaluationsSubject.next([...this.templateEvaluations]);
    }
  }

  // Ru00e9cupu00e9rer le nom d'une compu00e9tence (technologie ou sous-catu00e9gorie) basu00e9e sur son type et son ID
  getSkillName(type: 'technology' | 'subcategory', itemId: number): string {
    if (type === 'technology') {
      const tech = this.technologyService.getTechnologyById(itemId);
      return tech ? tech.name : 'Technologie inconnue';
    } else {
      const subcat = this.technologyService.getSubcategoryById(itemId);
      return subcat ? subcat.name : 'Sous-catu00e9gorie inconnue';
    }
  }

  // Mu00e9thode pour mettre u00e0 jour les compu00e9tences d'un candidat en fonction de l'u00e9valuation
  private updateCandidateSkills(evaluation: TemplateEvaluation): void {
    this.mockDataService.getCandidate(evaluation.candidateId).subscribe(candidate => {
      if (candidate) {
        // S'assurer que le candidat a un objet skills
        if (!candidate.skills) {
          candidate.skills = {};
        }

        // Mettre u00e0 jour les compu00e9tences avec les scores de l'u00e9valuation
        evaluation.skillEvaluations.forEach(skillEval => {
          const skillName = this.getSkillName(skillEval.skillType, skillEval.skillId);
          candidate.skills![skillName] = skillEval.score;
        });

        // Mettre u00e0 jour le candidat
        this.mockDataService.updateCandidate(candidate.id, candidate);
      }
    });
  }
}
