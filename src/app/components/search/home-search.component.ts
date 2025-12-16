import { Component } from '@angular/core';
import { MovieSearchComponent } from '../../views/search/movie-search.component';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [MovieSearchComponent], // ✅ MovieSearchComponent를 가져옵니다.
  template: `
    <div class="search-page-container">
      <app-movie-search></app-movie-search>
    </div>
  `,
  styles: [`
    .search-page-container {
      padding-top: 80px; /* 헤더에 가리지 않게 여백 */
      min-height: 100vh;
      background-color: #141414;
    }
  `]
})
export class HomeSearchComponent {}
