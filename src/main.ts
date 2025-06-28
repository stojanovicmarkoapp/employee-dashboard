import { bootstrapApplication } from '@angular/platform-browser';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
bootstrapApplication(DashboardComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch((err) => console.error(err));
