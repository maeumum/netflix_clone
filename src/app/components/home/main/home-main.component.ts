import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { URLService } from '../../../util/movie/URL'; // 경로 확인 필요 (util/movie/URL.ts)
import { Movie } from '../../../../models/types'; // 경로 확인 필요

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {
  bannerMovie: Movie | null = null;

  popularMovies: Movie[] = [];
  nowPlayingMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  animationMovies: Movie[] = [];

  private apiKey = '';

  constructor(
    private http: HttpClient,
    private urlService: URLService
  ) {}

  ngOnInit(): void {
    // 1. 로그인 때 저장한 API 키 가져오기
    this.apiKey = localStorage.getItem('TMDb-Key') || '';

    if (this.apiKey) {
      this.loadMovies();
    } else {
      console.error('API Key not found in LocalStorage');
    }
  }

  async loadMovies() {
    // 1. 배너 영화 가져오기 (URLService의 axios 메소드 활용)
    this.bannerMovie = await this.urlService.fetchFeaturedMovie(this.apiKey);

    // 2. 영화 리스트 4개 호출 (URLService의 URL 생성 메소드 활용)

    // (1) 인기 영화
    this.http.get<any>(this.urlService.getURL4PopularMovies(this.apiKey))
      .subscribe(res => this.popularMovies = res.results);

    // (2) 최신 영화 (Release)
    this.http.get<any>(this.urlService.getURL4ReleaseMovies(this.apiKey))
      .subscribe(res => this.nowPlayingMovies = res.results);

    // (3) 장르: 액션 (ID: 28)
    this.http.get<any>(this.urlService.getURL4GenreMovies(this.apiKey, '28'))
      .subscribe(res => this.actionMovies = res.results);

    // (4) 장르: 애니메이션 (ID: 16)
    this.http.get<any>(this.urlService.getURL4GenreMovies(this.apiKey, '16'))
      .subscribe(res => this.animationMovies = res.results);
  }

  // HTML에서 사용할 이미지 경로 헬퍼
  getImgUrl(path: string | undefined): string {
    // path가 없으면 빈 문자열 반환 (undefined 체크)
    return path ? this.urlService.getImageUrl(path) : '';
  }
}
