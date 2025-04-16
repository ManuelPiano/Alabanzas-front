import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "./spinner/spinner.component";

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que sea standalone si estás usando Angular 17+
  imports: [RouterOutlet, SpinnerComponent], // Añadir a los imports
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ministerioAlabanza';
}