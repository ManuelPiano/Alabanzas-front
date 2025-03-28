import { Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';

export const routes: Routes = [
    { path: '', component: SongListComponent }, // Página principal con lista de canciones
  { path: 'song/:id', component: SongDetailComponent },
];
