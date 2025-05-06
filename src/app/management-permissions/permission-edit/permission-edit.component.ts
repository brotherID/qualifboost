import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
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
export class PermissionEditComponent implements OnInit {

  permissionForm: FormGroup;
  idPermission?: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private permissionService: PermissionService , private snackBar: MatSnackBar,private router: Router) {
    this.permissionForm = this.fb.group({
      permission: ['']
    });
  }

  private loadForm(permission: Permission) {
    this.permissionForm.patchValue({
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
    console.log("idPermission ** :",this.idPermission);
    if (this.idPermission) {
      this.permissionService.updatePermission(this.idPermission ,this.permissionForm.value).subscribe({
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

  ngOnInit(): void {
      const idPermission = this.route.snapshot.paramMap.get('id');
      console.info("idPermission :",idPermission);
      if (idPermission) {
        this.idPermission = idPermission;
        this.permissionService.getPermissionById(idPermission).subscribe(data => {
          this.loadForm(data);
        });
      }
  }




}
