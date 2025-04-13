// Modèle pour les technologies
export interface Technology {
  id: number;
  name: string;
  subcategoryId: number;
}

// Modèle pour les sous-catégories
export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  technologies: Technology[];
}

// Modèle pour les catégories
export interface TechnologyCategory {
  id: number;
  name: string;
  subcategories: Subcategory[];
}
