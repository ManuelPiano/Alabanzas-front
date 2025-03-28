import { Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';

export const routes: Routes = [
  { path: '', component: SongListComponent },
  { 
    path: 'song', 
    component: SongDetailComponent,
    data: { renderMode: 'client-only' } // Desactiva el prerenderizado
  }
];
