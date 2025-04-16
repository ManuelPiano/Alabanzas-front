import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service.service'; 
import { SongDataService } from '../song-data.service'; // Importa el servicio de datos de la canción
@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SongListComponent implements OnInit {

  songs: any[] = [];
  isLoggedIn: boolean = false;
  diaSemana: string = '';

  constructor(private songService: SongService, private router: Router, private authService: AuthService, 
              private songDataService: SongDataService
  ) {}
  async showAll() {
    const allSongs = await this.songService.getSongs();
    this.songs = allSongs;
  }
  async ngOnInit() {
    try {
      const allSongs = await this.songService.getSongs();
      this.songs = allSongs.filter(song => song.active === true);
      this.songs.sort((a, b) => {
        if (!a.comodin && !a.ofrenda) return -1; // Las canciones con comodin y ofrenda en false van primero
        if (a.ofrenda && !a.comodin) return 1;  // Las canciones con ofrenda en true van después
        if (a.comodin) return 2;                // Las canciones con comodin en true van al final
        return 0;
      });
      this.songDataService.setSongs(this.songs); // Guarda las canciones en el servicio de datos
      console.log('Canciones obtenidas:', this.songs);
      this.isLoggedIn = this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
      console.log('Usuario autenticado:', this.isLoggedIn);
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const fechaActual = new Date();
      const dia = fechaActual.getDay();
      this.diaSemana = dias[dia]; // Obtiene el nombre del día de la semana
      console.log('Día de la semana:', this.diaSemana);
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  }

  goToSong(song: any) {
    this.songDataService.setSong(song);
    this.router.navigate(['/song']);
  }
  goToEditSong(song: any) {
    this.router.navigate(['/create-song'], {
      queryParams: {
        id: song.id,
        title: song.title,
        artist: song.author,
        lyrics: song.lyrics
      }
    });
  }
  goToCreateSong() {
    this.router.navigate(['/create-song']); // Redirige al componente de creación de canciones
  }
  goToLogin() {
    this.router.navigate(['/login']); // Redirige al componente de login
  }
  logOut() {
    this.authService.logout();
    this.isLoggedIn = false;
    alert('Sesión cerrada');
    this.router.navigate(['/']); // Redirige a la página principal
  }
}