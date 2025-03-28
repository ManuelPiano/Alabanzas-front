import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SongListComponent implements OnInit {
  songs: any[] = [];

  constructor(private songService: SongService, private router: Router) {}

  async ngOnInit() {
    try {
      this.songs = await this.songService.getSongs();
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  }

  goToSong(id: number) {
    this.router.navigate(['/song', id]);
  }
}