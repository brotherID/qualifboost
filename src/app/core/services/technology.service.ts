import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, flatMap } from 'rxjs/operators';
import { TechnologyCategory, Subcategory, Technology } from '../models/technology.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  // Données statiques pour les catégories, sous-catégories et technologies
  private categories: TechnologyCategory[] = [
    {
      id: 1,
      name: 'Java',
      subcategories: [
        {
          id: 101,
          name: 'Core Java',
          categoryId: 1,
          technologies: [
            { id: 1001, name: 'Java 8', subcategoryId: 101 },
            { id: 1002, name: 'Java 11', subcategoryId: 101 },
            { id: 1003, name: 'Java 17', subcategoryId: 101 }
          ]
        },
        {
          id: 102,
          name: 'Spring',
          categoryId: 1,
          technologies: [
            { id: 1004, name: 'Spring Boot', subcategoryId: 102 },
            { id: 1005, name: 'Spring JPA', subcategoryId: 102 },
            { id: 1006, name: 'Spring Security', subcategoryId: 102 },
            { id: 1007, name: 'Spring Cloud', subcategoryId: 102 }
          ]
        },
        {
          id: 103,
          name: 'Build Tools',
          categoryId: 1,
          technologies: [
            { id: 1008, name: 'Maven', subcategoryId: 103 },
            { id: 1009, name: 'Gradle', subcategoryId: 103 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Testing',
      subcategories: [
        {
          id: 201,
          name: 'Tests Unitaires',
          categoryId: 2,
          technologies: [
            { id: 2001, name: 'JUnit', subcategoryId: 201 },
            { id: 2002, name: 'TestNG', subcategoryId: 201 },
            { id: 2003, name: 'Mockito', subcategoryId: 201 }
          ]
        },
        {
          id: 202,
          name: 'Tests Fonctionnels',
          categoryId: 2,
          technologies: [
            { id: 2004, name: 'Selenium', subcategoryId: 202 },
            { id: 2005, name: 'Cucumber', subcategoryId: 202 },
            { id: 2006, name: 'Cypress', subcategoryId: 202 }
          ]
        },
        {
          id: 203,
          name: 'Tests de Performance',
          categoryId: 2,
          technologies: [
            { id: 2007, name: 'JMeter', subcategoryId: 203 },
            { id: 2008, name: 'Gatling', subcategoryId: 203 }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'DevOps',
      subcategories: [
        {
          id: 301,
          name: 'Services Cloud',
          categoryId: 3,
          technologies: [
            { id: 3001, name: 'AWS', subcategoryId: 301 },
            { id: 3002, name: 'Azure', subcategoryId: 301 },
            { id: 3003, name: 'GCP', subcategoryId: 301 }
          ]
        },
        {
          id: 302,
          name: 'Conteneurisation',
          categoryId: 3,
          technologies: [
            { id: 3004, name: 'Docker', subcategoryId: 302 },
            { id: 3005, name: 'Kubernetes', subcategoryId: 302 },
            { id: 3006, name: 'Helm', subcategoryId: 302 }
          ]
        },
        {
          id: 303,
          name: 'CI/CD',
          categoryId: 3,
          technologies: [
            { id: 3007, name: 'Jenkins', subcategoryId: 303 },
            { id: 3008, name: 'GitLab CI', subcategoryId: 303 },
            { id: 3009, name: 'GitHub Actions', subcategoryId: 303 }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'JavaScript',
      subcategories: [
        {
          id: 401,
          name: 'Frameworks',
          categoryId: 4,
          technologies: [
            { id: 4001, name: 'Angular', subcategoryId: 401 },
            { id: 4002, name: 'React', subcategoryId: 401 },
            { id: 4003, name: 'Vue.js', subcategoryId: 401 }
          ]
        },
        {
          id: 402,
          name: 'Backend',
          categoryId: 4,
          technologies: [
            { id: 4004, name: 'Node.js', subcategoryId: 402 },
            { id: 4005, name: 'Express', subcategoryId: 402 },
            { id: 4006, name: 'NestJS', subcategoryId: 402 }
          ]
        },
        {
          id: 403,
          name: 'Outils',
          categoryId: 4,
          technologies: [
            { id: 4007, name: 'TypeScript', subcategoryId: 403 },
            { id: 4008, name: 'Webpack', subcategoryId: 403 },
            { id: 4009, name: 'Jest', subcategoryId: 403 }
          ]
        }
      ]
    },
    {
      id: 5,
      name: '.NET',
      subcategories: [
        {
          id: 501,
          name: 'Core',
          categoryId: 5,
          technologies: [
            { id: 5001, name: '.NET Core', subcategoryId: 501 },
            { id: 5002, name: '.NET 5+', subcategoryId: 501 },
            { id: 5003, name: 'Entity Framework', subcategoryId: 501 }
          ]
        },
        {
          id: 502,
          name: 'Web',
          categoryId: 5,
          technologies: [
            { id: 5004, name: 'ASP.NET Core', subcategoryId: 502 },
            { id: 5005, name: 'Blazor', subcategoryId: 502 },
            { id: 5006, name: 'MVC', subcategoryId: 502 }
          ]
        }
      ]
    }
  ];

  private categoriesSubject = new BehaviorSubject<TechnologyCategory[]>(this.categories);

  constructor() {}

  // Méthodes pour récupérer les catégories
  getCategories(): Observable<TechnologyCategory[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryById(id: number): TechnologyCategory | undefined {
    return this.categories.find(category => category.id === id);
  }

  // Méthodes pour récupérer les sous-catégories
  getSubcategories(categoryId?: number): Subcategory[] {
    let result: Subcategory[] = [];
    
    if (categoryId) {
      // Récupérer les sous-catégories d'une catégorie spécifique
      const category = this.getCategoryById(categoryId);
      if (category) {
        result = category.subcategories;
      }
    } else {
      // Récupérer toutes les sous-catégories de toutes les catégories
      this.categories.forEach(category => {
        result = [...result, ...category.subcategories];
      });
    }
    
    return result;
  }

  getSubcategoryById(id: number): Subcategory | undefined {
    for (const category of this.categories) {
      const subcategory = category.subcategories.find(sc => sc.id === id);
      if (subcategory) {
        return subcategory;
      }
    }
    return undefined;
  }

  // Méthodes pour récupérer les technologies
  getTechnologies(subcategoryId?: number): Technology[] {
    let result: Technology[] = [];
    
    if (subcategoryId) {
      // Récupérer les technologies d'une sous-catégorie spécifique
      const subcategory = this.getSubcategoryById(subcategoryId);
      if (subcategory) {
        result = subcategory.technologies;
      }
    } else {
      // Récupérer toutes les technologies de toutes les sous-catégories
      this.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          result = [...result, ...subcategory.technologies];
        });
      });
    }
    
    return result;
  }

  getTechnologyById(id: number): Technology | undefined {
    for (const category of this.categories) {
      for (const subcategory of category.subcategories) {
        const technology = subcategory.technologies.find(t => t.id === id);
        if (technology) {
          return technology;
        }
      }
    }
    return undefined;
  }

  // Obtenir les technologies d'une sous-catégorie
  getTechnologiesBySubcategoryId(subcategoryId: number): Technology[] {
    // Chercher dans toutes les catégories
    for (const category of this.categories) {
      // Chercher dans les sous-catégories
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        return [...subcategory.technologies]; // Retourner une copie pour éviter les modifications accidentelles
      }
    }
    return [];
  }

  // Obtenez les informations complètes sur une technologie (avec sa catégorie et sous-catégorie)
  getTechnologyInfo(technologyId: number): { category: string; subcategory: string; technology: string } | undefined {
    for (const category of this.categories) {
      for (const subcategory of category.subcategories) {
        const technology = subcategory.technologies.find(t => t.id === technologyId);
        if (technology) {
          return {
            category: category.name,
            subcategory: subcategory.name,
            technology: technology.name
          };
        }
      }
    }
    return undefined;
  }

  // Chercher des technologies par texte
  searchTechnologies(searchText: string): Technology[] {
    if (!searchText) return [];
    
    const searchLower = searchText.toLowerCase();
    const results: Technology[] = [];
    
    this.categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        const matchingTechs = subcategory.technologies.filter(tech => 
          tech.name.toLowerCase().includes(searchLower)
        );
        results.push(...matchingTechs);
      });
    });
    
    return results;
  }

  // Méthodes pour la gestion des catégories, sous-catégories et technologies
  
  // Ajouter une nouvelle catégorie
  addCategory(name: string): Observable<TechnologyCategory> {
    // Génération d'un ID unique
    const newId = Math.max(0, ...this.categories.map(c => c.id)) + 1;
    
    // Création de la nouvelle catégorie
    const newCategory: TechnologyCategory = {
      id: newId,
      name,
      subcategories: []
    };
    
    // Ajout à la liste des catégories
    this.categories.push(newCategory);
    
    // Simule un appel API
    return of(newCategory).pipe(delay(300));
  }
  
  // Ajouter une nouvelle sous-catégorie
  addSubcategory(categoryId: number, name: string): Observable<Subcategory> {
    // Recherche de la catégorie parent
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      return throwError(() => new Error('Catégorie non trouvée'));
    }
    
    // Génération d'un ID unique pour la sous-catégorie
    const allSubcategories = this.categories.flatMap(c => c.subcategories);
    const newId = Math.max(0, ...allSubcategories.map(s => s.id)) + 1;
    
    // Création de la nouvelle sous-catégorie
    const newSubcategory: Subcategory = {
      id: newId,
      name,
      categoryId: categoryId,
      technologies: []
    };
    
    // Ajout à la catégorie parent
    category.subcategories.push(newSubcategory);
    
    // Simule un appel API
    return of(newSubcategory).pipe(delay(300));
  }
  
  // Ajouter une nouvelle technologie
  addTechnology(subcategoryId: number, name: string): Observable<Technology> {
    // Recherche de la sous-catégorie parent
    let foundSubcategory: Subcategory | undefined;
    
    for (const category of this.categories) {
      foundSubcategory = category.subcategories.find(s => s.id === subcategoryId);
      if (foundSubcategory) break;
    }
    
    if (!foundSubcategory) {
      return throwError(() => new Error('Sous-catégorie non trouvée'));
    }
    
    // Génération d'un ID unique pour la technologie
    const allTechnologies = this.categories
      .flatMap(c => c.subcategories)
      .flatMap(s => s.technologies);
    const newId = Math.max(0, ...allTechnologies.map(t => t.id)) + 1;
    
    // Création de la nouvelle technologie
    const newTechnology: Technology = {
      id: newId,
      name,
      subcategoryId: subcategoryId
    };
    
    // Ajout à la sous-catégorie parent
    foundSubcategory.technologies.push(newTechnology);
    
    // Simule un appel API
    return of(newTechnology).pipe(delay(300));
  }
  
  // Supprimer une catégorie
  deleteCategory(categoryId: number): Observable<void> {
    const index = this.categories.findIndex(c => c.id === categoryId);
    if (index === -1) {
      return throwError(() => new Error('Catégorie non trouvée'));
    }
    
    this.categories.splice(index, 1);
    return of(undefined).pipe(delay(300));
  }
  
  // Supprimer une sous-catégorie
  deleteSubcategory(subcategoryId: number): Observable<void> {
    for (const category of this.categories) {
      const index = category.subcategories.findIndex(s => s.id === subcategoryId);
      if (index !== -1) {
        category.subcategories.splice(index, 1);
        return of(undefined).pipe(delay(300));
      }
    }
    
    return throwError(() => new Error('Sous-catégorie non trouvée'));
  }
  
  // Supprimer une technologie
  deleteTechnology(technologyId: number): Observable<void> {
    for (const category of this.categories) {
      for (const subcategory of category.subcategories) {
        const index = subcategory.technologies.findIndex(t => t.id === technologyId);
        if (index !== -1) {
          subcategory.technologies.splice(index, 1);
          return of(undefined).pipe(delay(300));
        }
      }
    }
    
    return throwError(() => new Error('Technologie non trouvée'));
  }
}
