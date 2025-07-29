import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface FavoriteArtist {
  artistId: string;
  addedDate: string;  
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  //private apiUrl = 'http://localhost:3000/api/users';
  private apiUrl = 'https://artsy2bypunith-429730.wl.r.appspot.com/api/users';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<FavoriteArtist[]> {
    return this.http.get<{ favoriteArtists: FavoriteArtist[] }>(`${this.apiUrl}/favorites`, { 
      withCredentials: true
    }).pipe(
      map(response => response.favoriteArtists || [])
    );
  }

  addFavorite(artistId: string): Observable<FavoriteArtist[]> {
    return this.http.post<{ favoriteArtists: FavoriteArtist[] }>(
      `${this.apiUrl}/favorites`,
      { artistId },
      { withCredentials: true }
    ).pipe(
      map(response => response.favoriteArtists || [])
    );
  }

  removeFavorite(artistId: string): Observable<FavoriteArtist[]> {
    return this.http.delete<{ favoriteArtists: FavoriteArtist[] }>(
      `${this.apiUrl}/favorites/${artistId}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.favoriteArtists || [])
    );
  }
}
