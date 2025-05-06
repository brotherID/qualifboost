import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {NgForOf} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {RoleService} from '../../core/services/role.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-role-add',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    MatFormField,
    MatCheckbox,
    NgForOf,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleAddComponent {

  roleForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,private roleService: RoleService
  , private snackBar: MatSnackBar) {
    this.roleForm = this.formBuilder.group({
      role: ['', Validators.required],
      isAdmin: [false],
      isSuperAdmin: [false],
      permissionList: this.formBuilder.array([])
    });
  }

  get permissionList(): FormArray {
    return this.roleForm.get('permissionList') as FormArray;
  }

  addPermission(): void {
    this.permissionList.push(this.formBuilder.group({ value: [''] }));
  }

  removePermission(index: number): void {
    this.permissionList.removeAt(index);
  }


  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  onSubmit(): void {
    const formValue = this.roleForm.value;

    const payload = {
      role: formValue.role,
      isAdmin: formValue.isAdmin,
      isSuperAdmin: formValue.isSuperAdmin,
      permissionsDto: formValue.permissionList.map((p: any) => p.value)
    };

    console.log('Payload à envoyer :', payload);

    this.roleService.addRole(payload).subscribe({
      next: (res) => {
        console.log('Rôle ajouté avec succès !', res);
        this.showSnackbar('Rôle créé avec succès');
        this.router.navigate(['/management-roles']);
      },
      error: (err) => {
        if (err.status === 409) {
          console.error('Permissions n existent pas  :');
          this.showSnackbar('Permissions n existent pas  ');
        }else{
          console.error('Erreur lors de la création du rôle :', err);
          this.showSnackbar('Erreur lors de la création du rôle',err);
        }


      }
    });
  }
}
