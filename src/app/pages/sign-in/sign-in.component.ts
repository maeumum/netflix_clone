import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 👇 [핵심 수정 1] 점 2개(..)로 상위 폴더로 이동합니다. (오타 주의!)
// components 폴더 탈출(..) -> app 폴더 탈출(..) -> util 폴더 진입
import { AuthService } from '../../util/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoginMode: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      apiKey: ['', Validators.required],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      apiKey: ['', Validators.required],
      confirmApiKey: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const rememberedId = this.authService.getRememberedId();
    if (rememberedId) {
      this.loginForm.patchValue({ email: rememberedId, rememberMe: true });
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('apiKey')?.value === g.get('confirmApiKey')?.value
      ? null : { mismatch: true };
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    const { email, apiKey, rememberMe } = this.loginForm.value;

    // 👇 [핵심 수정 2] (success: boolean) 타입을 명시해서 TS7006 에러 해결
    this.authService.login(email, apiKey, rememberMe).subscribe((success: boolean) => {
      if (success) {
        alert('로그인 성공!');
        this.router.navigate(['/browse']);
      } else {
        alert('로그인 실패: 이메일이나 API Key를 확인하세요.');
      }
    });
  }

  onSignup() {
    if (this.signupForm.invalid) return;

    const { email, apiKey } = this.signupForm.value;

    // 👇 [핵심 수정 2] (success: boolean) 타입을 명시해서 TS7006 에러 해결
    this.authService.register(email, apiKey).subscribe((success: boolean) => {
      if (success) {
        alert('회원가입 성공! 로그인 해주세요.');
        this.toggleMode();
        this.loginForm.patchValue({ email: email });
      } else {
        alert('회원가입 실패: 이미 존재하는 이메일입니다.');
      }
    });
  }
}
