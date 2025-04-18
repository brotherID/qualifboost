import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {authInterceptor} from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withViewTransitions(),
      withComponentInputBinding(),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor]),withFetch()),
    provideClientHydration(),
    provideStore(),
    provideEffects()
  ]
};
