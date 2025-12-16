export interface SearchOptions {
  [key: string]: string;  // 인덱스 시그니처
  originalLanguage: string;
  translationLanguage: string;
  sorting: string;
}

export interface Movie {
  id: number;
  title?: string;       // 영화 제목
  name?: string;        // TV 시리즈 제목 (title 대신 들어오는 경우)
  overview: string;     // 줄거리
  poster_path: string;  // 포스터 이미지 경로
  backdrop_path: string; // 배경 이미지 경로
  vote_average: number; // 평점
  release_date?: string; // 개봉일
  first_air_date?: string; // TV 첫 방영일
  original_language?: string;
}

// 필요하다면 export를 붙여서 다른 파일에서도 쓸 수 있게 하세요.
export interface APIResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}
