import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = environment.apiURL + 'songs';
  private selectedSongId: number | null = null;

  constructor(private http: HttpClient) {}

  async getSongs(): Promise<any[]> {
    try {
      const response = await this.http.get<any[]>(`${this.apiUrl}`).toPromise();
      if (!response) {
        throw new Error('No se pudo obtener las canciones.');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSongById(id: number): Promise<any> {
    try {
      const response = await this.http.get<any[]>(`${this.apiUrl}`+ '/'+id).toPromise();
      if (!response) {
        throw new Error('No se pudo obtener las canciones.');
      }
      console.log('Canciones obtenidas:', response);
      this.selectedSongId = id; // Guardar el ID de la canción seleccionada
      return response;
    } catch (error) {
      console.error('Error al obtener las canciones:', error);
      throw error;
    }
  }
  getSelectedSongId(): number | null {
    return this.selectedSongId;
  }

  async createSong(title: string, artist: string, lyrics: string, active:boolean): Promise<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('author', artist)
      .set('lyrics', lyrics)
      .set('active', active); 
  
    return await this.http.post<any>(`${this.apiUrl}/create`, null, { params }).toPromise();
  }

  async updateSong(id: number, title: string, artist: string, lyrics: string, active: boolean): Promise<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('author', artist)
      .set('lyrics', lyrics)
      .set('active', active.toString()); // Convertir booleano a string
  
    return await this.http.put<any>(`${this.apiUrl}/update/${id}`, null, { params }).toPromise();
  }

}