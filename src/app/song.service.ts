import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = environment.apiURL + 'songs';

  constructor(private http: HttpClient) {}

  async getSongs(): Promise<any[]> {
    try {
      const response = await this.http.get<any[]>(`${this.apiUrl}`).toPromise();
      if (!response) {
        throw new Error('No se pudo obtener las canciones.');
      }
      console.log('Canciones obtenidas:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener las canciones:', error);
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
      return response;
    } catch (error) {
      console.error('Error al obtener las canciones:', error);
      throw error;
    }
  }
}