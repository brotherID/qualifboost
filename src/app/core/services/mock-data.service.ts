import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { Job, RequiredSkill } from '../models/job.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private candidates: Candidate[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      grade: 'Senior',
      contractType: 'CDI',
      dailyRate: 650,
      mainTechnology: 'Java',
      status: 'Disponible',
      evaluations: [
        { technology: 'Java', score: 4, comments: 'Très bon niveau' },
        { technology: 'Spring', score: 4, comments: 'Bonne expérience' }
      ],
      skills: {
        'Java': 4,
        'Spring': 4,
        'SQL': 3
      },
      title: 'Lead Developer Java',
      email: 'jean.dupont@example.com',
      phone: '06 12 34 56 78',
      availability: 'Immédiate',
      experience: 8,
      location: 'Paris',
      salary: 65
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      grade: 'Confirmé',
      contractType: 'Freelance',
      dailyRate: 550,
      mainTechnology: 'JavaScript',
      status: 'En mission',
      evaluations: [
        { technology: 'JavaScript', score: 4, comments: 'Excellent' },
        { technology: 'React', score: 3, comments: 'Bon niveau' }
      ],
      skills: {
        'JavaScript': 4,
        'React': 3,
        'HTML/CSS': 4,
        'SQL': 2
      },
      title: 'Développeur Frontend React',
      email: 'marie.martin@example.com',
      phone: '07 98 76 54 32',
      availability: 'Dans 2 mois',
      experience: 5,
      location: 'Lyon',
      salary: 55
    }
  ];

  private jobs: Job[] = [
    {
      id: 1,
      title: 'Lead Developer Java',
      description: 'Nous recherchons un Lead Developer Java expérimenté',
      requiredSkills: [
        { technology: 'Java', minimumScore: 4, mandatory: true },
        { technology: 'Spring', minimumScore: 3, mandatory: true }
      ],
      requiredScore: 3.5
    },
    {
      id: 2,
      title: 'Développeur Frontend React',
      description: 'Poste de développeur React pour projet innovant',
      requiredSkills: [
        { technology: 'JavaScript', minimumScore: 3, mandatory: true },
        { technology: 'React', minimumScore: 4, mandatory: true }
      ],
      requiredScore: 3.5
    }
  ];

  private currentUser = new BehaviorSubject<{role: UserRole}>({ role: 'RC' });

  constructor() {}

  getCandidates(): Observable<Candidate[]> {
    return new BehaviorSubject<Candidate[]>(this.candidates).asObservable();
  }

  getCandidate(id: number): Observable<Candidate | undefined> {
    return new BehaviorSubject<Candidate | undefined>(
      this.candidates.find(c => c.id === id)
    ).asObservable();
  }

  addCandidate(candidate: Omit<Candidate, 'id'>): void {
    const newId = Math.max(...this.candidates.map(c => c.id)) + 1;
    this.candidates.push({ ...candidate, id: newId });
  }

  updateCandidate(id: number, candidate: Partial<Candidate>): void {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.candidates[index] = { ...this.candidates[index], ...candidate };
    }
  }

  deleteCandidate(id: number): void {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.candidates.splice(index, 1);
    }
  }

  getJobs(): Observable<Job[]> {
    return new BehaviorSubject<Job[]>(this.jobs).asObservable();
  }

  getJob(id: number): Observable<Job | undefined> {
    return new BehaviorSubject<Job | undefined>(
      this.jobs.find(j => j.id === id)
    ).asObservable();
  }

  addJob(job: Omit<Job, 'id'>): void {
    const newId = Math.max(...this.jobs.map(j => j.id)) + 1;
    this.jobs.push({ ...job, id: newId });
  }

  updateJob(id: number, job: Partial<Job>): void {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...job };
    }
  }

  deleteJob(id: number): void {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
  }

  getCurrentUser(): Observable<{role: UserRole}> {
    return this.currentUser.asObservable();
  }

  setCurrentUser(role: UserRole): void {
    this.currentUser.next({ role });
  }
  
  // Méthode pour obtenir le rôle actuel (utilisée par le composant de détail)
  getCurrentRole(): UserRole {
    return this.currentUser.value.role;
  }
  
  getMatchingCandidates(job: Job): Candidate[] {
    return this.candidates.filter(candidate => {
      // Vérifier les compétences obligatoires
      const mandatorySkills = job.requiredSkills.filter(skill => skill.mandatory);
      const hasMandatorySkills = mandatorySkills.every(
        required => ((candidate.skills || {})[required.technology] || 0) >= required.minimumScore
      );

      if (!hasMandatorySkills) return false;

      // Calculer le score global
      const totalSkills = job.requiredSkills.length;
      const matchingSkills = job.requiredSkills.filter(
        required => ((candidate.skills || {})[required.technology] || 0) >= required.minimumScore
      ).length;

      return (matchingSkills / totalSkills) >= 0.8;
    });
  }
}
