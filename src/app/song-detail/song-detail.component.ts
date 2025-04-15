import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../song.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SongDataService } from '../song-data.service';

interface Song {
  id: number;
  title: string;
  author: string;
  lyrics: string;
  active: boolean;
  ofrenda: boolean;
  comodin: boolean;
}

interface NavigationState {
  song: Song;
}
@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
})
export class SongDetailComponent implements OnInit {
  previousSong() {

  }
  nextSong() {
    const songs = this.songDataService.getSongs(); // Obtener la lista de canciones
    console.log('Lista de canciones:', songs);
    console.log('ID de la canción actual:', this.song.id);
    const currentIndex = songs.findIndex(song => song.id === this.song.id);
    console.log('Índice de la canción actual:', currentIndex);
    if (currentIndex === -1 || currentIndex === songs.length - 1) {
      console.error('No hay más canciones disponibles.');
      alert('No hay más canciones disponibles.');
      this.router.navigate(['/']); // Redirigir a la lista de canciones
    }
  
    const nextSong = songs[currentIndex + 1];
    this.songDataService.setSong(nextSong); // Actualizar la canción actual en el servicio
    console.log('Siguiente canción:', nextSong);
    this.song = nextSong;
    this.transposedLyrics = nextSong.lyrics; // Actualizar la letra transpuesta
 
  }
  song: any = {};
  transposedLyrics: string = '';
  // Variable para almacenar el número de transposición acumulada
  transpositionSteps: number = 0;

  constructor(private router: Router, private songService: SongService,
              private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private songDataService: SongDataService // Inyectar el servicio de datos de la canción
    
  ) {
    
  }
  ngOnInit(): void {
    this.song = this.songDataService.getSong();
    if (!this.song) {
      console.error('No se proporcionaron datos de la canción.');
      this.router.navigate(['/']); // Redirigir a la lista de canciones
    } else {
      console.log('Canción obtenida:', this.song);
      this.transposedLyrics = this.song.lyrics;
    }
  }

  get safeLyrics(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.transposedLyrics);
}
  transposeSong(steps: number) {
    this.transpositionSteps += steps;
    const chordRegex = /(\b|\(|^)([A-G][#b]?)(maj7|m7|7|m|dim|sus4|sus2|add9|aug|6|9|11|13)?(\b|\)|$|\/)/g;
    
    this.transposedLyrics = this.song.lyrics.replace(chordRegex, (match: string, prefix: string, root: string, suffix: string, postfix: string) => {
        const transposedChord = this.transposeChord(root, this.transpositionSteps);
        // Envolvemos el acorde en un span con la clase 'chord'
        return `${prefix}<span class="chord">${transposedChord}${suffix || ''}</span>${postfix}`;
    });
}

private transposeChord(root: string, steps: number): string {
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const enharmonicEquivalents: {[key: string]: string} = {
        'B#': 'C', 'Cb': 'B',
        'E#': 'F', 'Fb': 'E',
        'G##': 'A', 'Abb': 'G',
        'D##': 'E', 'Ebb': 'D',
        'A##': 'B', 'Bbb': 'A',
        'C##': 'D', 'Dbb': 'C',
        'F##': 'G', 'Gbb': 'F'
    };

    // Verificar si la nota ya está en el mapa de equivalentes
    if (enharmonicEquivalents[root]) {
        root = enharmonicEquivalents[root];
    }

    let index = allNotes.indexOf(root);
    if (index === -1) return root;

    let newIndex = (index + steps + allNotes.length) % allNotes.length;
    let newNote = allNotes[newIndex];

    // Asegurarse de que no devolvamos dobles sostenidos
    return enharmonicEquivalents[newNote] || newNote;
}

  increaseFontSize() {
    const lyricsElement = document.querySelector('.lyrics');
    if (lyricsElement) {
      const currentSize = parseFloat(getComputedStyle(lyricsElement as HTMLElement).fontSize);
      (lyricsElement as HTMLElement).style.fontSize = `${currentSize + 2}px`;
    }
  }
  decreaseFontSize() {
    const lyricsElement = document.querySelector('.lyrics');
    if (lyricsElement) {
      const currentSize = parseFloat(getComputedStyle(lyricsElement).fontSize);
      (lyricsElement as HTMLElement).style.fontSize = `${currentSize - 2}px`;
    }
  }
  goBack() {
    window.history.back();
  }
}
