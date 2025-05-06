import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {UserResponse} from '../core/models/userResponse';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../core/services/user.service';
import {MatTooltip} from '@angular/material/tooltip';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-management-users',
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatIconButton,
    MatTooltip,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    NgIf,
    NgClass
  ],
  templateUrl: './management-users.component.html',
  styleUrl: './management-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementUsersComponent implements OnInit {
  users: UserResponse[] = [];
  error: string | null = null;
  displayedColumns: string[] = ['username', 'enable', 'firstName', 'lastName','email','emailVerified','actions'];
  dataSource = new MatTableDataSource<UserResponse>();

  constructor(private userService: UserService
              ,private router: Router
              ,private dialog: MatDialog
              , private snackBar: MatSnackBar) {
  }



  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log("data :", data);
        this.users = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des users';
      }
    });
  }

  ngOnInit(): void {
     this.loadUsers();
  }

  editUser() {

  }

  deleteUser() {

  }
}
