import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {NgForOf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {RoleService} from '../../core/services/role.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Role} from '../../core/models/role';


@Component({
  selector: 'app-role-edit',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatCheckbox,
    NgForOf,
    MatIconButton,
    MatButton,
    MatTooltip,
    MatDialogModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleEditComponent  {
  roleForm: FormGroup;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private roleService: RoleService , private dialog: MatDialog, private snackBar: MatSnackBar,private router: Router) {
    this.roleForm = this.fb.group({
      role: [''], isAdmin: [false], isSuperAdmin: [false], permissionsDto: this.fb.array([])
    });

    const state = this.router.getCurrentNavigation()?.extras.state as { roleData: Role };
    const role = state?.roleData;

    if (role) {
      this.loadForm(role);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.roleService.getRoleById(id).subscribe(data => {
          this.loadForm(data);
        });
      }
    }

  }

  private loadForm(role: Role) {
    this.roleForm.patchValue({
      role: role.role,
      isAdmin: role.isAdmin,
      isSuperAdmin: role.isSuperAdmin
    });

    const permissionsArray = this.fb.array([]);
    role.permissionsDto.forEach(p => permissionsArray.push(this.fb.control(p)));
    this.roleForm.setControl('permissionsDto', permissionsArray);
  }





  onSubmit() {
    console.log("data request :",this.roleForm.value);
    this.roleService.updateRole(this.roleForm.value).subscribe({
      next: () => {
        this.showSnackbar(`Rôle mis à jour avec succès`);
        this.router.navigate(['/management-roles']);

      },
      error: (err) => {
        console.error('Erreur updateRole :', err);
        this.showSnackbar(`Erreur lors de la mise à jour du rôle :`, err);
      }
    });
  }

  get permissionsDto(): FormArray {
    return this.roleForm.get('permissionsDto') as FormArray;
  }

  addPermission() {
    this.permissionsDto.push(this.fb.control(''));
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }


  removePermission(index: number , permission : string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Voulez-vous vraiment supprimer la permission "${permission}" ?`
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const roleId = this.roleForm.get('role')?.value;
        if (!roleId) return;
        console.log("roleId : ",roleId);
        console.log("index :",index);
        console.log("permission :",permission);
        this.permissionsDto.removeAt(index);
        this.showSnackbar(`Permission "${permission}" supprimée avec succès`);
        // this.roleService.deletePermissionFromRole(roleId, permission).subscribe({
        //   next: () => {
        //     this.permissionList.removeAt(index);
        //     console.log(`Permission ${permission} supprimée avec succès.`);
        //     this.showSnackbar(`Permission "${permission}" supprimée avec succès`);
        //   },
        //   error: (err) => {
        //     console.error('Erreur lors de la suppression de la permission :', err);
        //     this.showSnackbar(`Erreur : impossible de supprimer la permission`, 'error');
        //   }
        // });
      }
    });
  }


}
