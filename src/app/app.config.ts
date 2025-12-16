import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// 👇 1. 이 import 문을 꼭 추가하세요!
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👇 2. providers 목록 안에 이 함수를 추가하고 콤마(,)를 찍어주세요!
    provideHttpClient()
  ]
};
