import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { Movie } from '../../../models/types';
import { MovieDetailModalComponent } from '../../components/modal/movie-detail-modal.component';

@Component({
  selector: 'app-movie-infinite-scroll',
  standalone: true,
  imports: [CommonModule, MovieDetailModalComponent],
  templateUrl: './movie-infinite-scroll.component.html',
  styleUrls: ['./movie-infinite-scroll.component.css']
})
export class MovieInfiniteScrollComponent implements OnInit {
  @Input() fetchUrl!: string; // 기본 API 주소 (page 제외)

  movies: Movie[] = [];
  page: number = 1;
  isLoading: boolean = false;
  hasMore: boolean = true;
  selectedMovie: Movie | null = null; // 모달용

  ngOnInit() {
    this.loadMoreMovies(); // 처음 시작할 때 1페이지 로드
  }

  // 스크롤 이벤트 감지
  @HostListener('window:scroll', [])
  onScroll(): void {
    // 현재 스크롤 위치 + 화면 높이 >= 전체 문서 높이 - 100px (바닥 근처)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.loadMoreMovies();
    }
  }

  async loadMoreMovies() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    try {
      // URL에 page 파라미터를 붙여서 요청
      const requestUrl = `${this.fetchUrl}&page=${this.page}`;
      const response = await axios.get(requestUrl);
      const newMovies = response.data.results;

      if (newMovies.length === 0) {
        this.hasMore = false; // 더 이상 가져올 영화가 없음
      } else {
        // 기존 목록 뒤에 새 영화들을 붙임 (Spread Operator)
        this.movies = [...this.movies, ...newMovies];
        this.page++; // 다음 페이지 준비
      }
    } catch (error) {
      console.error('Error fetching infinite movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getImageUrl(path: string): string {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : 'assets/no-image.png';
  }

  openDetail(movie: Movie) {
    this.selectedMovie = movie;
  }

  closeDetail() {
    this.selectedMovie = null;
  }
}
