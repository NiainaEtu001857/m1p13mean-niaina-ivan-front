import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink , CommonModule , FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  userType: 'SHOP' | 'CLIENT' | 'ADMIN' = 'CLIENT';
  email = '';
  password = '';
  constructor(
    private authService: AuthService,
    private router: Router 

  ) {}


  setUserType(type: 'SHOP' | 'CLIENT' | 'ADMIN') {
    this.userType = type;

    switch (type) {
      case 'SHOP':
        this.email = 'shop@gmail.com';
        this.password = 'shop'
        break;
      case 'CLIENT':
        this.email = 'john@gmail.com';
        this.password = '123456';
        break
      default:
        this.email = 'admin@gmail.com';
        this.password = 'admin';
        break;
    }
  }

  async login() {
    if (!this.email || !this.password) {
      alert('Please fill all required fields');
      return;
    }
    try {
      await this.authService.login(this.email, this.password , this.userType);
      switch (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string).role : null) {
        case 'SHOP':
          await this.router.navigate(['/boutiques']);
          break;  
        case 'ADMIN':
          await this.router.navigate(['/admin']);
          break;  
        default:
           await this.router.navigate(['/client']);
          break;
      }
    } catch (error: any) {
      alert(error.message);
    }
  }


}
