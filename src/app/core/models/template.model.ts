export interface TemplateSkill {
  id: number;
  type: 'technology' | 'subcategory'; // Une compétence peut être une technologie spécifique ou une sous-catégorie entière
  itemId: number; // ID de la technologie ou de la sous-catégorie
  comment?: string; // Commentaire optionnel sur la compétence
}

export interface EvaluationTemplate {
  id: number;
  title: string; // Ex: "Template Java Back-end"
  skills: TemplateSkill[];
  createdBy: string; // Utilisateur ayant créé le template (RC, RT, CP)
  createdAt: Date;
  updatedAt?: Date;
}

export interface CandidateSkillEvaluation {
  skillId: number;
  skillType: 'technology' | 'subcategory';
  skillName: string;
  score: number; // Score attribué (1-5)
  comment?: string; // Commentaire spécifique à cette compétence
  // Nouvelles propriétés pour les technologies associées à une sous-catégorie
  selectedTechnologies?: {
    id: number; // ID de la technologie existante ou -1 pour une nouvelle technologie
    name: string; // Nom de la technologie
    isNew?: boolean; // Indique si c'est une nouvelle technologie ajoutée par l'utilisateur
  }[];
}

export interface TemplateEvaluation {
  id: number;
  candidateId: number;
  templateId: number;
  evaluationDate: Date;
  skillEvaluations: CandidateSkillEvaluation[];
  overallAssessment: string; // Appréciation générale
  generalComments?: string; // Remarques/observations globales
  evaluatedBy: string; // Utilisateur ayant réalisé l'évaluation
}
