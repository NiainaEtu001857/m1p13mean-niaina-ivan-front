import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { environment } from '../../../environments/environment.prod';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { AuthService } from '../../page/login/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boutique-layout',
  imports: [RouterModule , RouterOutlet],
  templateUrl: './boutique-layout.component.html',
  styleUrl: './boutique-layout.component.css',
})
export class BoutiqueLayoutComponent {

  constructor(private authService: AuthService, private http: HttpClient , private router: Router) {}

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
  
  async onLogout() {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);

    } catch (err) {
      console.error(err);
    }
  }
}
