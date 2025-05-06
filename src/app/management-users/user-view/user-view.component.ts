import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatChip} from '@angular/material/chips';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {UserResponse} from '../../core/models/userResponse';
import {MatIcon} from '@angular/material/icon';
import {Permission} from '../../core/models/permission';

@Component({
  selector: 'app-user-view',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatChip,
    NgForOf,
    NgIf,
    MatIcon
  ],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserViewComponent  implements OnInit{
  user: UserResponse | null = null ;
  error: string | null = null;
  roles: string[] = [];
  permissions: Permission[] = [];

  constructor(private router: Router,
              private activateRoute: ActivatedRoute,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    console.log("id :",id);
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data) => {
          this.user = data;
          console.log("user :", data);
          this.roles = data.roles?.map(r => r.role) || [];
          data.roles?.forEach((r: any) => {
            this.permissions = r.permissions;
          });
          console.log("roles :", this.roles);
          console.log("permissions :", this.permissions);
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }


  cancel() {
    this.router.navigate(['/management-users']);
  }
}
