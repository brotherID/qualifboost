import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { TechnologyService } from '../../core/services/technology.service';
import { Technology, Subcategory, TechnologyCategory } from '../../core/models/technology.model';
import { UserRole } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-technology-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './technology-management.component.html',
  styleUrls: ['./technology-management.component.scss']
})
export class TechnologyManagementComponent implements OnInit {
  // Donnues
  categories: TechnologyCategory[] = [];
  selectedCategory: TechnologyCategory | null = null;
  selectedSubcategory: Subcategory | null = null;

  // Valeurs des formulaires
  newCategoryName = '';
  newSubcategoryName = '';
  newTechnologyName = '';

  // Colonnes pour les tableaux
  categoryColumns: string[] = ['id', 'name', 'subcategories', 'actions'];
  subcategoryColumns: string[] = ['id', 'name', 'technologies', 'actions'];
  technologyColumns: string[] = ['id', 'name', 'actions'];

  // Gestion des onglets
  activeTab = 'categories';

  // Gestion des rôles
  isRT = false;

  constructor(
    private technologyService: TechnologyService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkUserRole();
  }

  checkUserRole(): void {
    this.isRT = this.authService.getCurrentUserRole() === 'RT';
  }

  loadCategories(): void {
    // Utiliser la méthode existante getCategories()
    this.technologyService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Gestion des catégories
  selectCategory(category: TechnologyCategory): void {
    this.selectedCategory = category;
    this.selectedSubcategory = null;
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      this.technologyService.addCategory(this.newCategoryName).subscribe(newCategory => {
        this.categories.push(newCategory);
        this.newCategoryName = '';
        this.showSuccessMessage('Catégorie ajoutée avec succès');
      });
    }
  }

  deleteCategory(category: TechnologyCategory, event: Event): void {
    event.stopPropagation();
    if (category.subcategories.length > 0) {
      this.showErrorMessage('Impossible de supprimer une catégorie contenant des sous-catégories');
      return;
    }

    this.technologyService.deleteCategory(category.id).subscribe(() => {
      const index = this.categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        this.categories.splice(index, 1);
        if (this.selectedCategory && this.selectedCategory.id === category.id) {
          this.selectedCategory = null;
        }
        this.showSuccessMessage('Catégorie supprimée avec succès');
      }
    });
  }

  // Gestion des sous-catégories
  selectSubcategory(subcategory: Subcategory): void {
    this.selectedSubcategory = subcategory;
  }

  addSubcategory(): void {
    if (this.selectedCategory && this.newSubcategoryName.trim()) {
      this.technologyService.addSubcategory(this.selectedCategory.id, this.newSubcategoryName).subscribe(newSubcategory => {
        if (this.selectedCategory) {
          this.selectedCategory.subcategories.push(newSubcategory);
          this.newSubcategoryName = '';
          this.showSuccessMessage('Sous-catégorie ajoutée avec succès');
        }
      });
    }
  }

  deleteSubcategory(subcategory: Subcategory, event: Event): void {
    event.stopPropagation();
    if (subcategory.technologies.length > 0) {
      this.showErrorMessage('Impossible de supprimer une sous-catégorie contenant des technologies');
      return;
    }

    this.technologyService.deleteSubcategory(subcategory.id).subscribe(() => {
      if (this.selectedCategory) {
        const index = this.selectedCategory.subcategories.findIndex(s => s.id === subcategory.id);
        if (index !== -1) {
          this.selectedCategory.subcategories.splice(index, 1);
          if (this.selectedSubcategory && this.selectedSubcategory.id === subcategory.id) {
            this.selectedSubcategory = null;
          }
          this.showSuccessMessage('Sous-catégorie supprimée avec succès');
        }
      }
    });
  }

  // Gestion des technologies
  addTechnology(): void {
    if (this.selectedSubcategory && this.newTechnologyName.trim()) {
      this.technologyService.addTechnology(this.selectedSubcategory.id, this.newTechnologyName).subscribe(newTechnology => {
        if (this.selectedSubcategory) {
          this.selectedSubcategory.technologies.push(newTechnology);
          this.newTechnologyName = '';
          this.showSuccessMessage('Technologie ajoutée avec succès');
        }
      });
    }
  }

  deleteTechnology(technology: Technology, event: Event): void {
    event.stopPropagation();
    this.technologyService.deleteTechnology(technology.id).subscribe(() => {
      if (this.selectedSubcategory) {
        const index = this.selectedSubcategory.technologies.findIndex(t => t.id === technology.id);
        if (index !== -1) {
          this.selectedSubcategory.technologies.splice(index, 1);
          this.showSuccessMessage('Technologie supprimée avec succès');
        }
      }
    });
  }

  // Gestion des messages
  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
