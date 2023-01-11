import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, take, finalize, switchMap } from 'rxjs';
import { Toy } from 'src/app/core/components/interfaces/toy.interface';
import { ToysApiService } from 'src/app/core/services/toys/toys-api.service';
import { PreloaderService } from 'src/app/shared/services/preloader.service';

@Injectable({
  providedIn: 'root'
})

export class ToysService {
  private toys$$: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  toys$: Observable<Toy[]> = this.toys$$.asObservable();
  isToy: boolean = true;

  constructor(
    private toysApiService: ToysApiService,
    private preloaderService: PreloaderService
  ) {}

  getFilteredToys(data: string): Observable<Toy[]> {
    this.preloaderService?.show();

    return this.toysApiService.getToysFromAtlas()
    .pipe(
      map(res => res.filter(toy => toy.title
        .toLowerCase()
        .includes(data.toLowerCase()))),
      tap((toysArr: Toy[]) => this.toys$$
        .next(toysArr)
      ),
      tap(() => this.preloaderService.hide()),
      take(1)
    );
  }

  getToysFromAtlas(): Observable<Toy[]> {
    this.preloaderService.show();

    return this.toysApiService.getToysFromAtlas()
      .pipe(
        tap((data: Toy[]) => this.toys$$.next(data)),
        finalize(() => this.preloaderService.hide()),
        take(1)
      );
  }

  loadToys(): void {
    return this.toysApiService.loadToys();
  }

  addToy(data: Toy): Observable<Toy[]> {
    return this.toysApiService.addToy(data)
      .pipe(
        take(1)
      );
  }

  getToy(id: number): Observable<Toy> {
    return this.toysApiService.getToy(id);
  }

  editToy(id: number, toy: Toy) {
    return this.toysApiService.editToy(id, toy).pipe(
      take(1)
    )
  }

  deleteToy(id: number): Observable<Toy[]> {
    this.preloaderService?.show();

    return this.toysApiService.deleteToy(id)
      .pipe(
        switchMap(() => this.getToysFromAtlas()),
        finalize(() => this.preloaderService.hide())
      );
  }
}
