import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 👇 1. 이 줄을 추가하세요! (import 필수)
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👇 2. 여기에도 콤마(,) 찍고 추가하세요!
    provideHttpClient()
  ]
};
