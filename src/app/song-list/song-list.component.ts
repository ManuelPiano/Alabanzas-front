import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service.service'; 

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

  constructor(private songService: SongService, private router: Router, private authService: AuthService ) {}
  async showAll() {
    const allSongs = await this.songService.getSongs();
    this.songs = allSongs;
  }
  async ngOnInit() {
    try {
      const allSongs = await this.songService.getSongs();
      this.songs = allSongs.filter(song => song.active === true);
      console.log('Canciones obtenidas:', this.songs);
      this.isLoggedIn = this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  }

  goToSong(id: number) {
    sessionStorage.setItem('selectedSongId', id.toString()); // Guardar el ID en sessionStorage
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
}