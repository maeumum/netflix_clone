import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // HTML에서 *ngFor, *ngIf 등을 쓰기 위해 필요
import { ActivatedRoute } from '@angular/router';
import { URLService } from '../../util/movie/URL';
import { MovieGridComponent } from '../views/movie-grid.component';
import { SearchOptions } from '../../../models/types';

type DropdownKey = 'originalLanguage' | 'translationLanguage' | 'sorting';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, MovieGridComponent], // CommonModule과 MovieGridComponent 둘 다 필요
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  // --- [1] 검색 관련 변수 ---
  searchQuery: string = '';
  searchUrl: string = '';
  apiKey: string = localStorage.getItem('TMDb-Key') || '';

  // --- [2] 필터(Dropdown) 관련 변수 ---
  readonly dropdowns: Record<DropdownKey, string[]> = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어']
  };

  readonly DEFAULT_OPTIONS: SearchOptions = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)'
  };

  selectedOptions: SearchOptions = {...this.DEFAULT_OPTIONS};
  activeDropdown: DropdownKey | null = null;

  constructor(
    private route: ActivatedRoute,
    private urlService: URLService
  ) {}

  // --- [3] 초기화 로직 (URL 파라미터 감지) ---
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.updateSearchUrl();
    });
  }

  // 검색 URL을 생성하는 함수
  updateSearchUrl() {
    if (this.searchQuery) {
      // 현재는 검색어(query)만 반영합니다.
      // (추후 selectedOptions 값을 이용해 API URL에 필터를 추가하는 로직을 확장할 수 있습니다)
      this.searchUrl = this.urlService.getURL4SearchMovies(this.apiKey, this.searchQuery);
    }
  }

  // --- [4] 필터 UI 이벤트 핸들러 ---
  get dropdownEntries() {
    return Object.entries(this.dropdowns).map(([key, options]) => ({
      key: key as DropdownKey,
      options
    }));
  }

  toggleDropdown(key: DropdownKey): void {
    this.activeDropdown = this.activeDropdown === key ? null : key;
  }

  selectOption(key: DropdownKey, option: string): void {
    this.selectedOptions = {
      ...this.selectedOptions,
      [key]: option
    };
    this.activeDropdown = null;

    // 옵션이 바뀌면 검색 결과를 다시 불러올 수도 있습니다 (지금은 로직만 연결)
    this.updateSearchUrl();
  }

  clearOptions(): void {
    this.selectedOptions = {...this.DEFAULT_OPTIONS};
    this.updateSearchUrl();
  }
}
