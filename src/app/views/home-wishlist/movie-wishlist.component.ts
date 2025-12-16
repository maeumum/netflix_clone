import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../util/movie/wishlist'; // 경로 확인 (../../가 맞는지)
import { Movie } from '../../../models/types';
import { MovieDetailModalComponent } from '../../components/modal/movie-detail-modal.component';

@Component({
  selector: 'app-movie-wishlist',
  standalone: true,
  imports: [CommonModule, MovieDetailModalComponent],
  templateUrl: './movie-wishlist.component.html',
  styleUrls: ['./movie-wishlist.component.css']
})
export class MovieWishlistComponent implements OnInit {
  wishlist: Movie[] = [];
  selectedMovie: Movie | null = null;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.wishlistService.wishlist$.subscribe(movies => {
      this.wishlist = movies;
    });
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
