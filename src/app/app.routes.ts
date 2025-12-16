import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // ✅ 이거 임포트 확인!
import { HomeMainComponent } from './components/home/main/home-main.component';
import { HomePopularComponent } from './components/home/popular/home-popular.component';
import { HomeWishlistComponent } from './components/home/wishlist/home-wishlist.component';
import { HomeSearchComponent } from './components/search/home-search.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'browse', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  {
    path: 'browse',
    component: HomeComponent, // 👈 [핵심] 이 줄이 있어야 헤더가 보입니다!
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeMainComponent },
      { path: 'popular', component: HomePopularComponent },
      { path: 'wishlist', component: HomeWishlistComponent },
      { path: 'search', component: HomeSearchComponent }
    ]
  }
];
