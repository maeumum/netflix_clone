import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'registered_users'; // 가입된 회원 목록
  private tokenKey = 'TMDb-Key';         // 로그인 성공 시 저장할 API 키 (다른 컴포넌트가 이걸 씀)

  constructor(private http: HttpClient, private router: Router) {}

  // 1. 회원가입 (Local Storage에 유저 정보 저장)
  register(email: string, apiKey: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    // 중복 아이디 확인
    const exists = users.find((u: any) => u.email === email);
    if (exists) {
      return of(false);
    }

    // 새 유저 저장 (비밀번호 대신 API Key를 저장)
    const newUser = { email, apiKey };
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return of(true);
  }

  // 2. 로그인 (유저 확인 + API 키 유효성 검증)
  login(email: string, apiKey: string, rememberMe: boolean): Observable<boolean> {
    // (1) 로컬 스토리지에서 유저 찾기
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return of(false); // 가입 안 된 이메일
    }

    // (2) 입력한 API Key가 맞는지 TMDB에 찔러보기 (검증)
    return this.http.get(`https://api.themoviedb.org/3/configuration?api_key=${apiKey}`).pipe(
      map(() => {
        // 성공 시 로직

        // A. API Key를 토큰처럼 저장 (다른 페이지에서 영화 불러올 때 씀)
        localStorage.setItem(this.tokenKey, apiKey);

        // B. Remember Me 처리
        if (rememberMe) {
          localStorage.setItem('remember_me_id', email);
        } else {
          localStorage.removeItem('remember_me_id');
        }

        return true;
      }),
      catchError(() => {
        // API 키가 틀렸거나 만료됨
        return of(false);
      })
    );
  }

  // 로그아웃
  logout() {
    localStorage.removeItem(this.tokenKey); // 키 삭제
    this.router.navigate(['/signin']);
  }

  // 로그인 상태 확인 (Guard에서 사용)
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Remember Me 아이디 가져오기
  getRememberedId(): string {
    return localStorage.getItem('remember_me_id') || '';
  }
}
