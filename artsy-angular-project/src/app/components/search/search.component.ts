import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../../category-modal/category-modal.component';
import { AuthService } from '../../auth/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { DomSanitizer } from '@angular/platform-browser'; 
import { ActivatedRoute, Router } from '@angular/router';

interface FavoriteArtist {
  artistId: string;
  addedDate: string; 
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchInput = new FormControl(''); 
  searchResult: any[] = []; 
  loading: boolean = false;
  selectedArtistDetails: any = null;
  selectedArtist: any = null;
  activeTab: string = 'info'; 
  artworks: any[] = [];
  similarArtists: any[] = [];
  isLoggedIn = false;
  artistDetailsLoading: boolean = false;
  artworksLoading: boolean = false;
  searchPerformed: boolean = false; 

  favoriteArtists: Set<string> = new Set(); 

  constructor(
    private apiService: ApiService, 
    private dialog: MatDialog, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private favoritesService: FavoritesService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadFavorites();
      } else {
        this.favoriteArtists.clear();
      }
    });
  
    this.route.queryParams.subscribe((params) => {
      const artistId = params['artistId'];
      if (artistId) {
        this.fetchArtistDetails(artistId); 
      }
    });
  }
  

  private loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (favorites: FavoriteArtist[]) => {
        this.favoriteArtists = new Set(favorites.map(f => f.artistId));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading favorites:', err)
    });
  }
  

  onSearch(): void {
    const artistName = this.searchInput.value?.trim(); 
    if (!artistName) {
      console.error('Please enter an artist name.');
      return;
    }

    this.loading = true; 
    this.apiService.searchArtist(artistName).subscribe(
      (response) => {
        this.searchResult = response; 
        this.loading = false; 
      },
      (error) => {
        console.error('Error occurred:', error);
        this.loading = false; 
      } 
    );
    this.searchPerformed = true;
  }

  onClear(): void {
    this.searchInput.reset(); 
    this.searchResult = [];
    this.selectedArtistDetails = null; 
    this.searchPerformed = false; 
  }

  onArtistClick(artist: any): void {
    this.selectedArtist = artist; // Store selected artist

    // Navigate to the same route with the artist ID as a query parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { artistId: artist.id },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
    this.fetchArtistDetails(artist.id); // Fetch and display artist details
  }

  private fetchArtistDetails(artistId: string): void {
    this.artistDetailsLoading = true;
    this.artworksLoading = true;
  
    // Fetch artist details
    this.apiService.getArtistDetails(artistId).subscribe(
      (response) => {
        const formattedBiography = response.biography
          .replace(/\n\n/g, `</p><p>`)
          .replace(/\n/g, `<br>`)
          .replace(/- /g, ``);
        response.biography = this.sanitizer.bypassSecurityTrustHtml(
          `<p>${formattedBiography}</p>`
        );
        this.selectedArtistDetails = response; 
  
        // Fetch artworks for the selected artist
        this.apiService.getArtworks(artistId).subscribe(
          (artworksResponse) => {
            this.artworks = artworksResponse; 
            this.artworksLoading = false; // Set loading to false
          },
          (error) => {
            console.error('Error fetching artworks:', error);
            this.artworks = []; // Reset artworks on error
            this.artworksLoading = false;
          }
        );
  
        // Fetch similar artists for the selected artist
        this.apiService.getSimilarArtists(artistId).subscribe(
          (similarArtistsResponse) => {
            this.similarArtists = similarArtistsResponse;
          },
          (error) => {
            console.error('Error fetching similar artists:', error);
            this.similarArtists = [];
          }
        );
  
        this.artistDetailsLoading = false;
      },
      (error) => {
        console.error('Error fetching artist details:', error);
        this.selectedArtistDetails = null;
        this.artworks = []; // Reset artworks if artist details fail to load
        this.artistDetailsLoading = false;
      }
    );
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openCategoryModal(artwork: any): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      data: {
        id: artwork.id,
        title: artwork.title,
        year: artwork.date,
        thumbnail: artwork.thumbnail
      },
      panelClass: 'custom-modal-width',
    });

    dialogRef.afterOpened().subscribe(() => {
      const closeButton = document.querySelector('.btn-close') as HTMLElement;
      if (closeButton) {
        closeButton.focus(); 
      }
    });
  }

  isFavorite(artist: any): boolean {
    return this.favoriteArtists.has(artist.id);
  }

 
  toggleFavorite(event: Event, artist: any): void {
    event.stopPropagation();
    if (!this.isLoggedIn) return;
    
    const isRemoving = this.isFavorite(artist);
    const updateMethod = isRemoving
      ? this.favoritesService.removeFavorite(artist.id)
      : this.favoritesService.addFavorite(artist.id);
    
    updateMethod.subscribe({
      next: (updatedFavorites) => {
        this.favoriteArtists = new Set(updatedFavorites.map(f => f.artistId));
        this.cdr.detectChanges(); 
        
        if (isRemoving) {
          this.notificationService.removeFromFavorites();
        } else {
          this.notificationService.addToFavorites();
        }
      },
      error: (error) => {
        console.error('Error updating favorites:', error);
        this.loadFavorites(); 
      }
    });
  }
}
  
