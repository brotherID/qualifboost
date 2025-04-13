export interface RequiredSkill {
  technology: string;
  minimumScore: number;
  mandatory?: boolean;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requiredSkills: RequiredSkill[];
  requiredScore?: number;
  githubUrl?: string;
  comment?: string;
}
