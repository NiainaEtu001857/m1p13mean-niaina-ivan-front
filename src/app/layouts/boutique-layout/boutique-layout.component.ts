import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../page/login/auth.service';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../footer/footer.component';
@Component({
  selector: 'app-boutique-layout',
  imports: [RouterModule, RouterOutlet, FooterComponent],
  templateUrl: './boutique-layout.component.html',
  styleUrl: './boutique-layout.component.css',
})
export class BoutiqueLayoutComponent {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

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
