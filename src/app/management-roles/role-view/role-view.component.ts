import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Role} from '../../core/models/role';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService} from '../../core/services/role.service';
import { MatCardModule} from '@angular/material/card';
import { MatChipsModule} from '@angular/material/chips';
import { NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';



@Component({
  selector: 'app-role-view',
  imports: [
    MatCardModule,
    MatChipsModule,
    NgIf,
    NgForOf,
    MatButton
  ],
  templateUrl: './role-view.component.html',
  styleUrl: './role-view.component.scss'
})
export class RoleViewComponent implements OnInit {
  role: Role | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      console.log("id :",id);
      if (id) {
        this.roleService.getRoleById(id).subscribe({
          next: (data) => {
            this.role = data;
            console.log("role :", data);
            this.cdRef.detectChanges();
          }
        });

     }
  }


  cancel() {
    this.router.navigate(['/management-roles']);
  }
}
