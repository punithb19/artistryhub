import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { ApiService } from '../../services/api.service';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { TimeAgoService } from '../../services/time-ago.service';
import { Router } from '@angular/router';

interface FavoriteArtist {
  artistId: string;
  addedDate: string; 
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteArtistIds: string[] = [];
  favoriteArtistsDetails: any[] = [];
  loading = true;
  timeAgoMap: { [key: string]: Observable<string> } = {};

  constructor(
    private favoritesService: FavoritesService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private timeAgoService: TimeAgoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.favoritesService.getFavorites().pipe(
      switchMap((favorites: FavoriteArtist[]) => {
        this.favoriteArtistIds = favorites.map(f => f.artistId);
        const detailsRequests = favorites.map(favorite => 
          this.apiService.getArtistDetails(favorite.artistId).pipe(
            map(details => ({
              ...details,
              addedDate: favorite.addedDate 
            })),
            catchError(error => {
              console.error(`Error fetching details for artist ${favorite.artistId}:`, error);
              return of(null);
            })
          )
        );
        if (this.favoriteArtistIds.length === 0) {
          this.loading = false; // Stop loading if no favorites
          return of([]); // Return empty array if no favorites
        }
        return forkJoin(detailsRequests);
      })
    ).subscribe({
      next: (detailsArray) => {
        this.favoriteArtistsDetails = detailsArray
        .filter(details => details !== null)
        .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
        this.createTimeAgoObservables();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.loading = false;
      }
    });
  }

  private createTimeAgoObservables(): void {
    this.timeAgoMap = {};
    this.favoriteArtistsDetails.forEach(artist => {
      const addedDate = new Date(artist.addedDate); // Convert to Date here
      this.timeAgoMap[artist.id] = this.timeAgoService.getRelativeTime(addedDate);
    });
  }

  removeFromFavorites(artistId: string): void {
    this.favoritesService.removeFavorite(artistId).subscribe({
      next: () => {
        this.favoriteArtistsDetails = this.favoriteArtistsDetails.filter(
          artist => artist.id !== artistId
        );
        delete this.timeAgoMap[artistId];
      },
      error: (error) => console.error('Error removing favorite:', error)
    });
    this.notificationService.removeFromFavorites();
  }

  viewArtistDetails(artistId: string): void {
    this.router.navigate(['/search'], { queryParams: { artistId } });
  }

  ngOnDestroy(): void {
    this.timeAgoMap = {};
  }
}
