import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { PreloaderService } from './shared/services/preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'christmas-joy';

  constructor(
    public router: Router,
    private preloaderService: PreloaderService
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.preloaderService.show();
      }
      if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        this.preloaderService.hide();
      }
    })
  }
}
