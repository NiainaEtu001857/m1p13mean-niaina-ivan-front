import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../page/login/auth.service';


@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private http: HttpClient , private router: Router) {}

  onLogout() {
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

