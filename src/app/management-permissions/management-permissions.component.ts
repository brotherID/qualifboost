import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {Role} from '../core/models/role';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Permission} from '../core/models/permission';
import {PermissionService} from '../core/services/permission.service';

@Component({
  selector: 'app-management-permissions',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    MatTooltip,
    NgIf,
    RouterLink,
    MatButton,
    MatHeaderCellDef
  ],
  templateUrl: './management-permissions.component.html',
  styleUrl: './management-permissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementPermissionsComponent  implements OnInit,  AfterViewInit{
  permissions: Permission[] = [];
  error: string | null = null;
  displayedColumns: string[] = ['permission', 'actions'];
  dataSource = new MatTableDataSource<Permission>();

  constructor(private permissionService: PermissionService,private router: Router
    ,private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;

    if (state?.loadPermissions) {
      this.loadPermissions();
    }
  }




  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        console.log("data :", data);
        this.permissions = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des rôles';
      }
    });
  }

  editPermission(permission: Permission) {
    this.router.navigate(['/permissions/edit', permission.id], {
      state: { permissionData: permission }
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  deletePermission(permission: Permission) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Voulez-vous vraiment supprimer cette  permission "${permission.id}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.permissionService.deletePermission(permission.id).subscribe({
          next: () => {
            this.showSnackbar(` Permission "${permission.id}" supprimé avec succès`);
            this.loadPermissions();
          },
          error: err => {
            console.error(err);
            this.showSnackbar(` Erreur lors de la suppression du Permission`);
          }
        });
      }
    });
  }

}
