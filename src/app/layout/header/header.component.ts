import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrolled = false;
  searchTerm: string = '';
  showDropdown: boolean = false; // 드롭다운 메뉴 표시 여부

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/browse/search'], { queryParams: { q: this.searchTerm } });
    }
  }

  // 드롭다운 메뉴 켜고 끄기
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // 로그아웃 로직
  logout() {
    // 저장된 키 삭제 (로그아웃 처리)
    localStorage.removeItem('TMDb-Key');
    // 로그인 화면으로 이동
    this.router.navigate(['/signin']);
  }
}
