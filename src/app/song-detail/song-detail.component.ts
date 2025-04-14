import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../song.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
})
export class SongDetailComponent implements OnInit {
  previousSong() {
    const currentSongId = Number(sessionStorage.getItem('selectedSongId'));
    
    // Verificar si el ID es menor o igual a 1
    if (currentSongId <= 1) {
      console.error('No hay canciones anteriores. El ID debe ser mayor a 1.');
      alert('No hay canciones anteriores.'); // Mensaje de alerta al usuario
      return; // Detener la ejecución del método
    }
  
    const previousSongId = currentSongId - 1; // Decrementar el ID de la canción
    sessionStorage.setItem('selectedSongId', previousSongId.toString()); // Guardar el nuevo ID en sessionStorage
    window.location.reload(); // Recargar la página para mostrar la nueva canción
  }
nextSong() {
    const currentSongId = Number(sessionStorage.getItem('selectedSongId'));
    const nextSongId = currentSongId + 1; // Incrementar el ID de la canción
    sessionStorage.setItem('selectedSongId', nextSongId.toString()); // Guardar el nuevo ID en sessionStorage
    window.location.reload(); // Recargar la página para mostrar la nueva canción
}
  song: any = {};
  transposedLyrics: string = '';
  // Variable para almacenar el número de transposición acumulada
  transpositionSteps: number = 0;

  constructor(private router: Router, private songService: SongService,
              private sanitizer: DomSanitizer
    
  ) {
    
  }
  async ngOnInit() {
    const id = Number(sessionStorage.getItem('selectedSongId')); // Obtener el ID desde sessionStorage
    if (!id) {
      console.error('No se seleccionó ninguna canción.');
      return;
    }
  
    try {
      this.song = await this.songService.getSongById(id);
      if (this.song.active === false) {
        console.error('La canción no está activa.');
        alert('No hay mas canciones para ahora.'); // Mensaje de alerta al usuario
        this.router.navigate(['/']); // Redirigir a la lista de canciones
      }
      this.transposedLyrics = this.song.lyrics;
      console.log('Canción obtenida:', this.song);
    } catch (error) {
      console.error(`Error al cargar la canción con ID ${id}:`, error);
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
