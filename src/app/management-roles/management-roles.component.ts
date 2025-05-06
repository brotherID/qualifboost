import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RoleService} from '../core/services/role.service';
import {NgClass, NgIf} from '@angular/common';
import {Role} from '../core/models/role';

import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';

import {ReactiveFormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-management-roles',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    NgClass,
    MatIconButton,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatExpansionModule,
    RouterLink,
    MatButton
  ],
  templateUrl: './management-roles.component.html',
  styleUrl: './management-roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementRolesComponent implements OnInit,  AfterViewInit{
  roles: Role[] = [];
  error: string | null = null;
  displayedColumns: string[] = ['role', 'isAdmin', 'isSuperAdmin', 'actions'];
  dataSource = new MatTableDataSource<Role>();

  constructor(private roleService: RoleService,private router: Router
              ,private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;

    if (state?.loadRoles) {
      this.loadRoles();
    }
  }




  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        console.log("data :", data);
        this.roles = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des rôles';
      }
    });
  }

  editRole(role: Role) {
    this.router.navigate(['/roles/edit', role.role], {
      state: { roleData: role }
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  deleteRole(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Voulez-vous vraiment supprimer ce role "${role.role}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.deleteRole(role.role).subscribe({
          next: () => {
            this.showSnackbar(` Rôle "${role.role}" supprimé avec succès`);
            this.loadRoles();
          },
          error: err => {
            console.error(err);
            this.showSnackbar(` Erreur lors de la suppression du rôle`);
          }
        });
      }
    });
  }
}
