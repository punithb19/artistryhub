import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string | null = null;
  avatarUrl: string | null = null; 
  authLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService 
  ) {}

  ngOnInit(): void {
    // Subscribe to currentUser$ to get user data
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userData => {
        this.isLoggedIn = !!userData;
        this.userName = userData?.username || null;
        this.avatarUrl = userData?.avatarUrl || null;
        this.authLoading = false;
      });
  }
  
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/search']),
      error: (err) => console.error('Logout failed:', err)
    });
    this.notificationService.loggedOut();
  }

  deleteAccount(): void {
    this.authService.deleteAccount().subscribe({
      next: () => this.router.navigate(['/search']),
      error: (err) => {
        console.error('Account deletion failed:', err);
        alert('Failed to delete account. Please try again.');
      }
    });
    this.notificationService.accountDeleted();
  }
}
