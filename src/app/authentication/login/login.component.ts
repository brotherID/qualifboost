import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatCardTitle,
    MatCard,
    MatCardContent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  accessToken: string | null = null;
  errorMessage: string | null = null;


  constructor(private authService: AuthService,private router: Router ) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        this.accessToken = response.access_token;
        localStorage.setItem('access_token', response.access_token);
        this.errorMessage = null;
        console.log('Token reçu:', this.accessToken);
        this.router.navigate(['/management-roles'], {
          state: { loadRoles: true }
        });

      },
      error: (err: any) => {
        this.errorMessage = 'Erreur de login';
        console.error(err);
      },
    });
  }

}
