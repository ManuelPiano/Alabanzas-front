import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit() {
    try {
      const response = await this.authService.loginWithBackend(this.username, this.password).toPromise();
      if (response && response.token) {
        this.authService.guardarToken(response.token);
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/']); // Redirigir a la página principal
      } else {
        alert('Error: No se recibió token');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Usuario o contraseña incorrectos');
    }
  }
}