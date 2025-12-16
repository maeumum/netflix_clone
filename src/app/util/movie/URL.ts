import axios from "axios";
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class URLService {
  fetchFeaturedMovie = async (apiKey: string) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      console.log(response.data.results[0]);
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      return null;
    }
  }

  getURL4PopularMovies = (apiKey: string, page: number = 1) => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
  }

  getURL4ReleaseMovies = (apiKey: string, page: number = 2) => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
  }

  getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1) => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  }

  getURL4SearchMovies = (apiKey: string, query: string, page: number = 1) => {
    // 검색어(query)를 포함해서 API 주소를 만듭니다.
    return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&page=${page}&query=${query}`;
  }

  getImageUrl(path: string | null): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/original${path}`;
  }
}

