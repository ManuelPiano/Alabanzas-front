import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongDataService {
  private songs: any[] = [];
  private currentSong: any;

  setSongs(songs: any[]): void {
    this.songs = songs;
  }

  getSongs(): any[] {
    return this.songs;
  }

  setSong(song: any): void {
    this.currentSong = song;
  }

  getSong(): any {
    return this.currentSong;
  }
}