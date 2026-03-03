import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  email = 'admin@gmail.com';
  password = 'admin';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await this.authService.login(this.email, this.password, 'ADMIN');
      await this.router.navigate(['/admin']);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert('Une erreur inattendue est survenue');
    }
  }

}
