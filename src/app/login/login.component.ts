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

  onSubmit() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.authService.login(); // Marca al usuario como logueado
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/']); // Redirige a la lista de canciones
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}