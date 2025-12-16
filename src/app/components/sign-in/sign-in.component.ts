import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 👇 [수정됨] 경로를 'util' 폴더의 AuthService로 정확히 지정
import { AuthService } from '../../util/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // HTML에서 사용하는 변수들 정의
  isLoginMode: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 로그인 폼 초기화
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      apiKey: ['', Validators.required],
      rememberMe: [false]
    });

    // 회원가입 폼 초기화
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      apiKey: ['', Validators.required],
      confirmApiKey: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // ngOnInit 구현 (Remember Me 체크)
  ngOnInit(): void {
    const rememberedId = this.authService.getRememberedId();
    if (rememberedId) {
      this.loginForm.patchValue({ email: rememberedId, rememberMe: true });
    }
  }

  // 화면 전환 토글 함수
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // 비밀번호 확인 검증기
  passwordMatchValidator(g: FormGroup) {
    return g.get('apiKey')?.value === g.get('confirmApiKey')?.value
      ? null : { mismatch: true };
  }

  // 로그인 버튼 클릭 시
  onLogin() {
    if (this.loginForm.invalid) return;

    const { email, apiKey, rememberMe } = this.loginForm.value;

    // (success: boolean) 타입 명시로 에러 해결
    this.authService.login(email, apiKey, rememberMe).subscribe((success: boolean) => {
      if (success) {
        alert('로그인 성공!');
        this.router.navigate(['/browse']); // 메인으로 이동
      } else {
        alert('로그인 실패: 이메일이나 비밀번호를 확인하세요.');
      }
    });
  }

  // 회원가입 버튼 클릭 시
  onSignup() {
    if (this.signupForm.invalid) return;

    const { email, apiKey } = this.signupForm.value;

    // (success: boolean) 타입 명시로 에러 해결
    this.authService.register(email, apiKey).subscribe((success: boolean) => {
      if (success) {
        alert('회원가입 성공! 로그인 해주세요.');
        this.toggleMode(); // 로그인 화면으로 이동
        this.loginForm.patchValue({ email: email });
      } else {
        alert('회원가입 실패: 이미 존재하는 이메일입니다.');
      }
    });
  }
}
