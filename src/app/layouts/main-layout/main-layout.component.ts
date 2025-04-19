import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RoleService} from '../../core/services/role.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    MatTooltip,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit{

  currentRole: string = '';

  constructor(private roleService: RoleService,private router: Router) {}

  ngOnInit(): void {
    this.roleService.getCurrentRole().subscribe({
      next: (role) => {
        console.log("role :",role);
        this.currentRole = role;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du rôle courant', err);
      }
    });
  }


  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
