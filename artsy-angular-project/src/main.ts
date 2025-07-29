import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes'; // Import the routes array
import { AuthInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide routing configuration
    provideHttpClient(withInterceptorsFromDi()), // Provide HTTP client with interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Attach JWT interceptor
  ],
}).catch((err) => console.error(err));
