import { Component } from '@angular/core';
import { URLService } from '../../../util/movie/URL';
import { MovieInfiniteScrollComponent } from '../../../views/views/movie-infinite-scroll.component'; // 경로 확인 필요

@Component({
  selector: 'app-home-popular',
  standalone: true,
  imports: [MovieInfiniteScrollComponent], // ✅ 임포트 필수
  template: `
    <div class="popular-page" style="padding-top: 80px;">
      <h2 style="padding-left: 20px; margin-bottom: 20px;">인기 영화</h2>

      <app-movie-infinite-scroll
        [fetchUrl]="popularUrl">
      </app-movie-infinite-scroll>
    </div>
  `
})
export class HomePopularComponent {
  popularUrl: string = '';
  apiKey: string = localStorage.getItem('TMDb-Key') || '';

  constructor(private urlService: URLService) {
    // page=1 부분을 떼고 기본 주소만 넘겨줍니다 (컴포넌트가 알아서 &page=1, 2, 3 붙임)
    // URLService의 함수를 약간 변형하거나 직접 문자열을 조작해도 됩니다.
    this.popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR`;
  }
}
