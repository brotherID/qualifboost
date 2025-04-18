import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Role} from '../../core/models/role';
import {PermissionService} from '../../core/services/permission.service';
import {Permission} from '../../core/models/permission';

@Component({
  selector: 'app-permission-edit',
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    RouterLink
  ],
  templateUrl: './permission-edit.component.html',
  styleUrl: './permission-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionEditComponent {

  permissionForm: FormGroup;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private permissionService: PermissionService , private dialog: MatDialog, private snackBar: MatSnackBar,private router: Router) {
    this.permissionForm = this.fb.group({
      id: [''],permission: ['']
    });

    const state = this.router.getCurrentNavigation()?.extras.state as { permissionData: Permission };
    const permission = state?.permissionData;

    if (permission) {
      this.loadForm(permission);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.permissionService.getPermissionById(id).subscribe(data => {
          this.loadForm(data);
        });
      }
    }

  }

  private loadForm(permission: Permission) {
    this.permissionForm.patchValue({
      id: permission.id,
      permission: permission.permission
    });
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }



  onSubmit() {
    console.log("data ** :",this.permissionForm.value);
    this.permissionService.updatePermission(this.permissionForm.value).subscribe({
      next: () => {
        this.showSnackbar(`Permission mis à jour avec succès`);
        this.router.navigate(['/management-permissions']);

      },
      error: (err) => {
        console.error('Erreur updatePermission :', err);
        this.showSnackbar(`Erreur lors de la mise à jour du Permission :`, err);
      }
    });
  }




}
