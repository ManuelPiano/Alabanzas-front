import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingInterceptor } from './app/loading.interceptor';

const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withInterceptors([LoadingInterceptor]))
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig).catch((err) => console.error(err));