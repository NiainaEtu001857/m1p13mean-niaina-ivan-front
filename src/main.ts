import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import localFr from '@angular/common/locales/fr'

registerLocaleData(localeEsAr);
registerLocaleData(localFr);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
