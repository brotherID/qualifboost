export interface TechnologyEvaluation {
  technology: string;
  score: number;
  comments: string;
  evaluatedBy?: string;
  evaluationDate?: Date;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  contractType: string;
  dailyRate: number;
  mainTechnology: string;
  status: string;
  cvUrl?: string;
  evaluations: TechnologyEvaluation[];
  skills?: { [key: string]: number };
  title?: string;
  email?: string;
  phone?: string;
  availability?: string;
  experience?: number;
  location?: string;
  salary?: number;
}
