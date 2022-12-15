import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PreloaderService {
  private preloaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.preloaderSubject.asObservable();

  show(): void {
    return this.preloaderSubject.next(true);
  }

  hide(): void {
    return this.preloaderSubject.next(false);
  }
}
