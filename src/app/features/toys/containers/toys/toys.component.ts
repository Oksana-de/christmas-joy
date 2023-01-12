import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, switchMap, take, tap } from 'rxjs';
import { Toy } from 'src/app/core/components/interfaces/toy.interface';
import { PreloaderService } from 'src/app/shared/services/preloader.service';
import { ToysService } from '../../services/toys.service';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.scss']
})

export class ToysComponent implements OnInit {

  @Input() item!: Toy;

  public toys$!: Observable<Toy[]>;
  public loading$!: Observable<boolean>;
  public isLoading!: boolean;

  isToys: boolean = true;
  searchInput: FormControl = new FormControl('');
  amountInput: FormControl = new FormControl('');

  constructor(
    private toysService: ToysService,
    private preloaderService: PreloaderService,
    private router: Router
  ) { }

  data!: Toy[];

  ngOnInit(): void {

    this.getToysFromAtlas();

    this.initPreloader();
    this.initToys();
    this.detectSearchToy();
    this.detectFilterParams();
  }

  initPreloader(): void {
    this.preloaderService.loading$
      ?.pipe(tap(val => this.isLoading = val))
      .subscribe();
  }

  handleEditBtnClick(id: number): void {
    this.router.navigate(['/toys', id]);
  }

  handleDeleteBtnClick(id: number): void {
    this.toysService?.deleteToy(id)
      .pipe(
        switchMap(() => this.toysService.getToysFromAtlas()),
        take(1)
      )
      .subscribe(
        res => {
          this.data = res;
        }
      );
  }

  detectSearchToy() {
    this.searchInput.valueChanges
    .pipe(
      tap(() => this.isToys = true),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(data => this.filterToys(data));
  }

  detectFilterParams() {
    this.amountInput.valueChanges
    .pipe(
      tap(() => this.isToys = true),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(data => {
      console.log(data);
      this.getToysFromAtlas(data);
    });
  }

  filterToys(data: string): void {
    this.toysService.getFilteredToys(data)
    .pipe(
      switchMap(() => this.toysService.getFilteredToys(data))
    )
    .subscribe(
      res => {
        this.isToys = res.length === 0
          ? !this.isToys
          : this.isToys;
      }
    );
  }

  getToysFromAtlas(params?: number): void {

    this.toysService.getToysFromAtlas(params)
      .subscribe(res => this.data = res);
  }

  initToys(): void {
    this.toys$ = this.toysService.toys$;
  }

  handleLoadMoreBtnClick(): void {
    this.toysService.loadToys();
    // this.toysService
    //   .getToys()
    //   .subscribe(res => {
    //     this.data = res;
    // });
  }
}
