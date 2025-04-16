import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService } from '../song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-create-song',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.scss'],
})
export class CreateSongComponent implements OnInit {
  id: number | null = null; // ID de la canción (si es una actualización)
  title: string = '';
  artist: string = '';
  lyrics: string = '';
  active: boolean = true;
  ofrenda: boolean = false;
  comodin: boolean = false;

  constructor(
    private songService: SongService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Leer parámetros de la ruta para prellenar los datos
    this.route.queryParams.subscribe((params) => {
      if (params['id']) this.id = +params['id']; // Convertir el ID a número
      if (params['title']) this.title = params['title'];
      if (params['artist']) this.artist = params['artist'];
      if (params['lyrics']) this.lyrics = params['lyrics'];
    });
  }

  onSubmit() {
    if (this.title && this.artist && this.lyrics) {
      if (this.id) {
        // Si hay un ID, actualiza la canción
        this.songService.updateSong(this.id, this.title, this.artist, this.lyrics, this.active, this.ofrenda, this.comodin)
          .then((response) => {
            console.log('Canción actualizada:', response);
            this.alertService.showAlert('Canción actualizada exitosamente', 'success');
            this.router.navigate(['/']); // Redirige a la lista de canciones
          })
          .catch((error) => {
            console.error('Error al actualizar la canción:', error);
            this.alertService.showAlert(error.error.message || 'Error al actualizar la canción', 'error');
          });
      } else {
        // Si no hay un ID, crea una nueva canción
        this.songService.createSong(this.title, this.artist, this.lyrics, this.active, this.ofrenda, this.comodin)
          .then((response) => {
            console.log('Canción creada:', response);
            this.alertService.showAlert('Canción creada exitosamente', 'success');
            this.router.navigate(['/']); // Redirige a la lista de canciones
          })
          .catch((error) => {
            console.error('Error al crear la canción:', error);
            this.alertService.showAlert(error.error.message || 'Error al crear la canción', 'error');
          });
      }
    } else {
      this.alertService.showAlert('Por favor completa todos los campos', 'error');
    }
  }
  goBack() {
    this.router.navigate(['/']);
  }
}