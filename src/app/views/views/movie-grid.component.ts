import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { Movie } from '../../../models/types';
import { WishlistService } from '../../util/movie/wishlist';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-grid.component.html',
  styleUrls: ['./movie-grid.component.css']
})
export class MovieGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() fetchUrl!: string;
  @ViewChild('gridContainer') gridContainer!: ElementRef<HTMLDivElement>;

  movies: Movie[] = [];
  isLoading: boolean = false; // [추가] 로딩 상태

  // 레이아웃 관련 변수
  currentPage = 1;
  rowSize = 4;
  moviesPerPage = 20;
  isMobile = window.innerWidth <= 768;
  currentView = 'grid';

  private resizeListener: () => void;

  constructor(private wishlistService: WishlistService) {
    this.resizeListener = this.handleResize.bind(this);
  }

  async ngOnInit() {
    this.calculateLayout();
    window.addEventListener('resize', this.resizeListener);
    if (this.fetchUrl) {
      await this.fetchMovies();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['fetchUrl'] && !changes['fetchUrl'].isFirstChange()) {
      this.movies = [];
      await this.fetchMovies();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  async fetchMovies(): Promise<void> {
    if (!this.fetchUrl) return;

    this.isLoading = true; // [추가] 로딩 시작
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies: Movie[] = [];

      const urlObj = new URL(this.fetchUrl);
      urlObj.searchParams.delete('page');
      const cleanUrl = urlObj.toString();

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(cleanUrl, {
          params: { page, per_page: this.moviesPerPage }
        });

        if (!response.data.results || response.data.results.length === 0) break;
        allMovies = [...allMovies, ...response.data.results];
      }

      this.movies = allMovies.slice(0, totalMoviesNeeded);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      this.isLoading = false; // [추가] 로딩 끝
    }
  }

  getImageUrl(path: string): string {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : 'assets/no-image.png';
  }

  // [수정] 클릭 시 실행될 함수: 추천(찜) 토글
  toggleWishlist(movie: Movie): void {
    this.wishlistService.toggleWishlist(movie);
  }

  // 현재 영화가 추천(찜) 상태인지 확인
  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  // --- 레이아웃 관련 (그대로 유지) ---
  get visibleMovieGroups(): Movie[][] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    const paginatedMovies = this.movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce<Movie[][]>((resultArray, item, index) => {
      const groupIndex = Math.floor(index / this.rowSize);
      if (!resultArray[groupIndex]) resultArray[groupIndex] = [];
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  }

  get totalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPerPage) || 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  private handleResize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.calculateLayout();
  }

  private calculateLayout(): void {
    if (this.gridContainer) {
      const container = this.gridContainer.nativeElement;
      const containerWidth = container.offsetWidth || window.innerWidth;
      const movieCardWidth = this.isMobile ? 90 : 200;
      const horizontalGap = this.isMobile ? 10 : 15;
      this.rowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      if (this.rowSize < 1) this.rowSize = 1;
      this.moviesPerPage = 20;
    }
  }
}
