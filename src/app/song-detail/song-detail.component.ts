import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../song.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SongDataService } from '../song-data.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';

interface Song {
  id: number;
  title: string;
  author: string;
  lyrics: string;
  active: boolean;
  ofrenda: boolean;
  comodin: boolean;
}

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SongDetailComponent implements OnInit {
  song: Song = {} as Song;
  transposedLyrics: string = '';
  transpositionSteps: number = 0;
  fontSize: number = 16; // Tamaño de fuente base en px
  
  constructor(
    private router: Router,
    private songService: SongService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private songDataService: SongDataService
  ) {}
  
  ngOnInit(): void {
    this.song = this.songDataService.getSong();
    if (!this.song) {
      console.error('No se proporcionaron datos de la canción.');
      this.router.navigate(['/']);
    } else {
      console.log('Canción obtenida:', this.song);
      this.transposedLyrics = this.formatLyrics(this.song.lyrics);
    }
  }
  
  // Formatea la letra inicial para resaltar los acordes
  private formatLyrics(lyrics: string): string {
    const chordRegex = /(\b|$$|^)([A-G][#b]?)(maj7|m7|7|m|dim|sus4|sus2|add9|aug|6|9|11|13)?(\b|$$|$|\/)/g;
    
    return lyrics.replace(chordRegex, (match: string, prefix: string, root: string, suffix: string, postfix: string) => {
      return `${prefix}<span class="chord">${root}${suffix || ''}</span>${postfix}`;
    });
  }
  
  get safeLyrics(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.transposedLyrics);
  }
  
  transposeSong(steps: number) {
    this.transpositionSteps += steps;
    const chordRegex = /(\b|$$|^)([A-G][#b]?)(maj7|m7|7|m|dim|sus4|sus2|add9|aug|6|9|11|13)?(\b|$$|$|\/)/g;
    
    this.transposedLyrics = this.song.lyrics.replace(chordRegex, (match: string, prefix: string, root: string, suffix: string, postfix: string) => {
      const transposedChord = this.transposeChord(root, this.transpositionSteps);
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
    const lyricsElement = document.querySelector('.lyrics') as HTMLElement;
    if (lyricsElement) {
      this.fontSize += 2;
      lyricsElement.style.fontSize = `${this.fontSize}px`;
    }
  }
  
  decreaseFontSize() {
    const lyricsElement = document.querySelector('.lyrics') as HTMLElement;
    if (lyricsElement) {
      this.fontSize = Math.max(10, this.fontSize - 2); // No permitir tamaños menores a 10px
      lyricsElement.style.fontSize = `${this.fontSize}px`;
    }
  }
  
  previousSong() {
    const songs = this.songDataService.getSongs();
    const currentIndex = songs.findIndex(song => song.id === this.song.id);
    
    if (currentIndex <= 0) {
      console.log('Esta es la primera canción.');
      return;
    }
    
    const prevSong = songs[currentIndex - 1];
    this.songDataService.setSong(prevSong);
    this.song = prevSong;
    this.transpositionSteps = 0; // Reiniciar transposición
    this.transposedLyrics = this.formatLyrics(prevSong.lyrics);
  }
  
  nextSong() {
    const songs = this.songDataService.getSongs();
    const currentIndex = songs.findIndex(song => song.id === this.song.id);
    
    if (currentIndex === -1 || currentIndex === songs.length - 1) {
      console.log('No hay más canciones disponibles.');
      return;
    }
    
    const nextSong = songs[currentIndex + 1];
    this.songDataService.setSong(nextSong);
    this.song = nextSong;
    this.transpositionSteps = 0; // Reiniciar transposición
    this.transposedLyrics = this.formatLyrics(nextSong.lyrics);
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
  
  // Atajos de teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowUp':
        this.transposeSong(1);
        break;
      case 'ArrowDown':
        this.transposeSong(-1);
        break;
      case 'ArrowRight':
        this.nextSong();
        break;
      case 'ArrowLeft':
        this.previousSong();
        break;
      case '+':
        this.increaseFontSize();
        break;
      case '-':
        this.decreaseFontSize();
        break;
      case 'Escape':
        this.goBack();
        break;
    }
  }
}