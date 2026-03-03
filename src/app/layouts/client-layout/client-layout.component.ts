import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../page/login/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-client-layout',
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css',
})
export class ClientLayoutComponent {

  constructor(private authService: AuthService, private http: HttpClient , private router: Router) {}
  
  async onLogout() {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
    }
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Fermer le dropdown si clic à l’extérieur
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropup')) {
      this.isDropdownOpen = false;
    }
  }
}
