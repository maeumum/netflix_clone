import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// 👇 우리가 만든 설정을 가져옵니다.
import { appConfig } from './app/app.config';

// 👇 appConfig를 사용해서 앱을 시작합니다.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
