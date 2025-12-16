import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/types';
import { WishlistService } from '../../util/movie/wishlist'; // WishlistService 임포트

@Component({
  selector: 'app-movie-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close()">X</button>

        <div class="modal-header" [style.backgroundImage]="'url(https://image.tmdb.org/t/p/original' + movie.backdrop_path + ')'">
          <div class="header-content">
            <h1>{{ movie.title }}</h1>
            <div class="buttons">
              <button class="play-btn">▶ 재생</button>
              <button class="wishlist-btn" (click)="toggleWishlist()">
                {{ isLiked ? '✅ 찜한 콘텐츠 취소' : '➕ 찜한 콘텐츠에 추가' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <p class="overview">{{ movie.overview || '상세 줄거리가 없습니다.' }}</p>
          <div class="info-row">
            <span>평점: ⭐ {{ movie.vote_average | number:'1.1-1' }}</span>
            <span>언어: {{ movie.original_language | uppercase }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; justify-content: center; align-items: center; }
    .modal-content { background: #141414; color: white; width: 90%; max-width: 800px; border-radius: 10px; overflow: hidden; position: relative; }
    .modal-header { height: 400px; background-size: cover; background-position: center; position: relative; }
    .header-content { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px; background: linear-gradient(to top, #141414, transparent); }
    .modal-body { padding: 30px; font-size: 16px; line-height: 1.6; }
    .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); border: none; color: white; font-size: 20px; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; z-index: 10; }

    /* 버튼 스타일 */
    .buttons { margin-top: 15px; display: flex; gap: 10px; }
    .play-btn { background-color: white; color: black; border: none; padding: 10px 25px; font-size: 1.2rem; font-weight: bold; border-radius: 5px; cursor: pointer; }
    .wishlist-btn { background-color: rgba(109, 109, 110, 0.7); color: white; border: none; padding: 10px 25px; font-size: 1.2rem; font-weight: bold; border-radius: 5px; cursor: pointer; }
    .wishlist-btn:hover { background-color: rgba(109, 109, 110, 0.4); }
  `]
})
export class MovieDetailModalComponent {
  @Input() movie!: Movie;
  @Output() onClose = new EventEmitter<void>();

  constructor(private wishlistService: WishlistService) {}

  // 현재 영화가 찜 목록에 있는지 확인
  get isLiked(): boolean {
    return this.wishlistService.isInWishlist(this.movie.id);
  }

  // 찜하기 토글
  toggleWishlist() {
    this.wishlistService.toggleWishlist(this.movie);
  }

  close() {
    this.onClose.emit();
  }
}
