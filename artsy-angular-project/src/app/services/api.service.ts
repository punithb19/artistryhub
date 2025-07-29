import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private baseUrl = 'http://localhost:3000/api'; // Backend URL
  private baseUrl = 'https://artsy2bypunith-429730.wl.r.appspot.com/api';
  constructor(private http: HttpClient) {}

  searchArtist(artistName: string): Observable<any> {
    const params = new HttpParams().set('artistName', artistName); 
    return this.http.get<any>(`${this.baseUrl}/search_artist?name=${artistName}`);
  }

  getArtistDetails(artistId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/artist/${artistId}`);
  }

  getSimilarArtists(artistId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/similar_artists/${artistId}`);
  }  

  getArtworks(artistId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/artworks/${artistId}`); 
  }

  getCategories(artworkId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/categories/${artworkId}`);
  }
}
