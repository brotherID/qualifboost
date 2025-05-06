import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PermissionService} from '../../core/services/permission.service';

@Component({
  selector: 'app-permission-add',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatFormField
  ],
  templateUrl: './permission-add.component.html',
  styleUrl: './permission-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionAddComponent {

  permissionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,private permissionService: PermissionService
    , private snackBar: MatSnackBar) {
    this.permissionForm = this.formBuilder.group({
      permission: ['', Validators.required]
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

  onSubmit(): void {
    const formValue = this.permissionForm.value;
    console.log("formValue :",formValue);
    this.permissionService.addPermission(formValue).subscribe({
      next: (res) => {
        console.log('Permission ajoutée avec succès !', res);
        this.showSnackbar('Permission créé avec succès');
        this.router.navigate(['/management-permissions']);
      },
      error: (err) => {
          console.error('Erreur lors de la création du permission :', err);
          this.showSnackbar('Erreur lors de la création du permission',err);
      }
    });
  }
}
