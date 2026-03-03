import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registre',
  imports: [CommonModule , FormsModule , RouterLink],
  templateUrl: './registre.html',
  styleUrl: './registre.css',
})
export class Registre {
  constructor(private authService: AuthService, private router: Router) {}
  
  selectedProfile: string = 'client';
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  shop = {
    name: '',
    type: '',
    description: '',
    email: '',
    password: ''
  };

  photoFile!: File;

  selectProfile(profile: string) {
    this.selectedProfile = profile;
  }

  async submit() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      alert('Please fill all required fields');
      return;
    }
    try{
      await this.authService.registerClient({ first_name: this.user.firstName,last_name: this.user.lastName, email: this.user.email, password: this.user.password })
      this.user = { firstName: '', lastName: '', email: '', password: '' }; 
      await this.router.navigate(['/client']);
    }catch(error: any)
    {
      alert(error.message);
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.photoFile = file;
    }
  }

  async submitShop() {
    if (!this.shop.name || !this.shop.email || !this.shop.type || !this.shop.description  || !this.shop.password) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', this.shop.name);
      formData.append('email', this.shop.email);
      formData.append('type', this.shop.type);
      formData.append('description', this.shop.description);
      formData.append('password', this.shop.password);
      if (this.photoFile) {
        formData.append('photo', this.photoFile);
      }
      if (!this.photoFile) {
        console.warn('Aucun fichier sélectionné !');
      }
      console.log([...formData]);
      
      await this.authService.registerShop(formData);
      alert('Shop registered successfully!');
      await this.router.navigate(['/boutiques']);

    } catch (error: any) {
      alert(error.message);
    }
  }

}
