import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, switchMap, take, tap } from 'rxjs';
import { FilterParametrs, Toy } from 'src/app/core/components/interfaces/toy.interface';
import { PreloaderService } from 'src/app/shared/services/preloader.service';
import { ToysService } from '../../services/toys.service';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.scss']
})

export class ToysComponent implements OnInit {

  @Input() item!: Toy;

  toysForUser = {
    sizes: [
      {
        name: 'big',
        selected: false,
        id: 1
      },
      {
        name: 'middle',
        selected: false,
        id: 2
      },
      {
        name: 'small',
        selected: false,
        id: 3
      }
    ]
  }

  public toys$!: Observable<Toy[]>;
  public loading$!: Observable<boolean>;
  public isLoading!: boolean;

  filterForm!: FormGroup;

  public rangeAccessiableAmount!: string;
  public rangeAccessiableYear!: string;

  isToys: boolean = true;
  searchInput: FormControl = new FormControl('');

  constructor(
    private toysService: ToysService,
    private preloaderService: PreloaderService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.filterForm = this.fb.group({
      amountInputMin: [5, [Validators.min(1), Validators.max(12)]],
      amountInputMax: [10, [Validators.min(1), Validators.max(12)]],
      yearInputMin: [1940, [Validators.min(1940), Validators.max(2022)]],
      yearInputMax: [2022, [Validators.min(1940), Validators.max(2022)]],
      sizes: this.buildSizeData(),
      favItem: [false]
    })

  }

  data!: Toy[];

  ngOnInit(): void {
    // this.initForm();

    this.getToysFromAtlas();

    this.initPreloader();
    this.initToys();
    this.detectSearchToy();

    this.getToysFromAtlas(this.filterForm.value);
    this.detectFilterParams();

    console.log((this.filterForm.get('sizes') as FormArray)['controls']);

  }

  // private initForm(): void {
  //   this.filterForm = this.fb.group({
  //     amountInputMin: [5, [Validators.min(1), Validators.max(12)]],
  //     amountInputMax: [10, [Validators.min(1), Validators.max(12)]],
  //     yearInputMin: [1940, [Validators.min(1940), Validators.max(2022)]],
  //     yearInputMax: [2022, [Validators.min(1940), Validators.max(2022)]],
  //     sizes: this.buildSizeData(),
  //     favItem: [false]
  //   })
  // }

  buildSizeData(): FormArray {
    const arr = this.toysForUser.sizes.map(size => {
      return this.fb.control(size.selected);
    });
    return this.fb.array(arr);
  }

  get sizeData() {
    return <FormArray>this.filterForm.get('sizes');
  }

  getSizesByIndex(id: number): FormControl {
    return this.sizeData.at(id) as FormControl;
  }

  rangeBackgroundAmount(): string {
    return `linear-gradient(to right, #fff 0%, #fff ${(Number(this.filterForm.controls['amountInputMin'].value) - 1)/11*100}%, #24c5db ${(Number(this.filterForm.controls['amountInputMin'].value) - 1)/11*100}%, #24c5db ${(Number(this.filterForm.controls['amountInputMax'].value) - 1)/11 * 100}%, #fff ${(Number(this.filterForm.controls['amountInputMax'].value) - 1)/11 * 100}%, #fff 100%)`;
  }
  rangeBackgroundYear(): string {
    return `linear-gradient(to right, #fff 0%, #fff ${(Number(this.filterForm.controls['yearInputMin'].value) - 1940)/(2022 - 1940)*100}%, #24c5db ${(Number(this.filterForm.controls['yearInputMin'].value) - 1940)/(2022 - 1940)*100}%, #24c5db ${(Number(this.filterForm.controls['yearInputMax'].value) - 1940)/(2022 - 1940) * 100}%, #fff ${(Number(this.filterForm.controls['yearInputMax'].value) - 1940)/(2022 - 1940) * 100}%, #fff 100%)`;
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
    Object.values(this.filterForm.controls).map(inst => {

      inst.valueChanges
      .pipe(
        tap(() => this.isToys = true),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((data: number) => {
        // TODO: Function
        if (inst === this.filterForm.controls['amountInputMin'] && inst.value > this.filterForm.controls['amountInputMax'].value) {
          inst.setValue(this.filterForm.controls['amountInputMax'].value);
        } else if (inst === this.filterForm.controls['amountInputMax'] && inst.value < this.filterForm.controls['amountInputMin'].value) {
          inst.setValue(this.filterForm.controls['amountInputMin'].value);
        } else if (inst === this.filterForm.controls['yearInputMin'] && inst.value > this.filterForm.controls['yearInputMax'].value) {
          inst.setValue(this.filterForm.controls['yearInputMax'].value);
        } else if (inst === this.filterForm.controls['yearInputMax'] && inst.value < this.filterForm.controls['yearInputMin'].value) {
          inst.setValue(this.filterForm.controls['yearInputMin'].value);
        }

        // TODO: Function
        this.rangeAccessiableAmount = this.filterForm.controls['amountInputMin'].value === this.filterForm.controls['amountInputMax'].value
          ? '2'
          : '0'

        this.rangeAccessiableYear = this.filterForm.controls['yearInputMin'].value === this.filterForm.controls['yearInputMax'].value
          ? '2'
          : '0'

          console.log(this.filterForm.value);

          const filterCombinationValue = Object.assign({}, this.filterForm.value, {

            sizes: this.filterForm.value.sizes.includes(true)
              ? this.filterForm.value.sizes.map((selected: boolean, i: number) => {
                  return selected
                      ? this.toysForUser.sizes[i].name
                      : false;
                })
              : this.filterForm.value.sizes.map((selected: boolean, i: number) => {
                return this.toysForUser.sizes[i].name;
              })
          });

          console.log(this.filterForm.value);


          console.log(filterCombinationValue);

        return this.getToysFromAtlas(filterCombinationValue);
      });
    }
    )
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

  getToysFromAtlas(params?: FilterParametrs): void {

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
