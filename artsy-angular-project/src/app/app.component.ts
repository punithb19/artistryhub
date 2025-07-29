import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './auth/auth.service'; 
import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationContainerComponent,
    AsyncPipe 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit {
  title = 'Artsy Search';

  constructor(public authService: AuthService) {}

ngOnInit(): void {
  this.authService.initializeAuthState().subscribe({
    error: (err) => {
      console.error('Auth state initialization failed:', err);
    }
  });
 }
}
