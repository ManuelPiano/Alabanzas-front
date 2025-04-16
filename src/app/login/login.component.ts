import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { AlertService } from '../alert.service';

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

  constructor(private router: Router, private authService: AuthService
              , private alertService: AlertService
  ) {}

  async onSubmit() {
    try {
      const response = await this.authService.loginWithBackend(this.username, this.password).toPromise();
      if (response && response.token) {
        this.authService.guardarToken(response.token);
        this.alertService.showAlert('Inicio de sesión exitoso', 'success');
        this.router.navigate(['/']); // Redirigir a la página principal
      } else {
        this.alertService.showAlert('Error al iniciar sesión', 'error');
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.alertService.showAlert('Error', 'error en el inicio de sesión');
    }
  }
}