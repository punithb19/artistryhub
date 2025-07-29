import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { AuthGuard } from './auth/auth.guard'; 
import { AuthRedirectGuard } from './auth/auth-redirect.guard';

export const routes: Routes = [
  { path: 'search', component: SearchComponent }, 
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] }, 
  { path: 'register', component: RegisterComponent, canActivate: [AuthRedirectGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search' },
];
