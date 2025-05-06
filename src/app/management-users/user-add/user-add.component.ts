import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {RoleService} from '../../core/services/role.service';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-user-add',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatButton,
    MatCheckbox,
    MatSelect,
    MatOption,
    NgForOf,
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddComponent  implements  OnInit{
  userAddForm: FormGroup ;
  availableRoles: string[]= [];

  constructor(private formBuilder: FormBuilder,
              private roleService: RoleService,
              private userService: UserService,
              private router: Router) {
    this.userAddForm = this.formBuilder.group({
      username: ['', Validators.required],
      enabled: [false],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      emailVerified: [false, Validators.required],
      password: ['', Validators.required],
      rolesName: [[]]
    });
  }

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles.map(r => r.role);
        console.log("Rôles disponibles :", this.availableRoles);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des rôles", err);
      }
    });
  }


  addUserSubmit() {
    const userAddFormValue = this.userAddForm.value;
    console.log("userAddFormValue : ",userAddFormValue);

    this.userService.createUser(userAddFormValue).subscribe({
      next: (res) => {
        console.log('User ajouté avec succès !', res);
        this.router.navigate(['/management-users']);
      },
      error: (err) => {
          console.error('Erreur lors de la création du user :', err);
      }
    });

  }


}
