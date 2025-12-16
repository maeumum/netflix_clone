import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'; // ✅ Sanitizer 추가
import { Movie } from '../../../models/types';
import { MovieDetailModalComponent } from '../../components/modal/movie-detail-modal.component';
import { URLService } from '../../util/movie/URL'; // ✅ URLService 추가

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, MovieDetailModalComponent],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnChanges {
  @Input() movie: Movie | null = null;

  // SafeStyle 타입으로 변경 (Angular가 신뢰하는 스타일)
  backdropStyle: SafeStyle | null = null;
  showModal = false;

  constructor(
    private sanitizer: DomSanitizer,
    private urlService: URLService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movie'] && this.movie) {
      const path = this.movie.backdrop_path || this.movie.poster_path;
      if (path) {
        // 1. URLService를 통해 이미지 주소를 가져옴
        const imageUrl = this.urlService.getImageUrl(path);

        // 2. 배경 이미지 CSS 전체를 Sanitizer로 감싸서 신뢰할 수 있게 만듦
        this.backdropStyle = this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
      }
    }
  }

  truncate(str: string, n: number) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  openDetail() {
    this.showModal = true;
  }

  closeDetail() {
    this.showModal = false;
  }
}
