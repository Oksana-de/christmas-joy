import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, switchMap, take, tap } from 'rxjs';
import { Filter, FilterCollection, FilterParametrs, Toy } from 'src/app/core/components/interfaces/toy.interface';
import { PreloaderService } from 'src/app/shared/services/preloader.service';
import { ToysService } from '../../services/toys.service';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.scss'],
  animations: [
    trigger('openClose', [
      state('openFilterMenu', style({
        display: 'flex',
        left: '10px'
      })),
      state('closedFilterMenu', style({
        display: 'block',
        left: 'calc(-700px)'
      })),
      transition('openFilterMenu <=> closedFilterMenu', [
        animate('.5s')
      ])
    ])
  ]
})

export class ToysComponent implements OnInit {

  @Input() item!: Toy;

  toysForUser: FilterCollection = {
    shapes: [
      {
        name: 'bell',
        selected: false,
        id: 1
      },
      {
        name: 'ball',
        selected: false,
        id: 2
      },
      {
        name: 'cone',
        selected: false,
        id: 3
      },
      {
        name: 'snowflake',
        selected: false,
        id: 4
      },
      {
        name: 'figurine',
        selected: false,
        id: 5
      }
    ],
    colors: [
      {
        name: 'white',
        selected: false,
        id: 1
      },
      {
        name: 'yellow',
        selected: false,
        id: 2
      },
      {
        name: 'red',
        selected: false,
        id: 3
      },
      {
        name: 'blue',
        selected: false,
        id: 4
      },
      {
        name: 'green',
        selected: false,
        id: 5
      }
    ],
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
      yearInputMin: [1940, [Validators.min(1940), Validators.max(2023)]],
      yearInputMax: [2023, [Validators.min(1940), Validators.max(2023)]],
      shapes: this.buildSizeData(this.toysForUser.shapes),
      colors: this.buildSizeData(this.toysForUser.colors),
      sizes: this.buildSizeData(this.toysForUser.sizes),
      favItem: [false]
    })
  }

  data!: Toy[];
  isOpen: boolean = false;

  ngOnInit(): void {
    this.initPreloader();
    this.initToys();
    this.detectSearchToy();
    this.detectFilterParams();
    this.showCollection();
  }

  buildSizeData(filter: Filter[]): FormArray {
    const arr: FormControl[] = filter.map(control => {
      return this.fb.control(control.selected);
    });
    return this.fb.array(arr);
  }

  get shapeData() {
    return <FormArray>this.filterForm.get('shapes');
  }
  get colorData() {
    return <FormArray>this.filterForm.get('colors');
  }
  get sizeData() {
    return <FormArray>this.filterForm.get('sizes');
  }

  getShapesByIndex(id: number): FormControl {
    return this.shapeData.at(id) as FormControl;
  }
  getColorsByIndex(id: number): FormControl {
    return this.colorData.at(id) as FormControl;
  }
  getSizesByIndex(id: number): FormControl {
    return this.sizeData.at(id) as FormControl;
  }

  rangeBackgroundAmount(): string {
    return `linear-gradient(to right, #fff 0%, #fff ${(Number(this.filterForm.controls['amountInputMin'].value) - 1)/11*100}%, #24c5db ${(Number(this.filterForm.controls['amountInputMin'].value) - 1)/11*100}%, #24c5db ${(Number(this.filterForm.controls['amountInputMax'].value) - 1)/11 * 100}%, #fff ${(Number(this.filterForm.controls['amountInputMax'].value) - 1)/11 * 100}%, #fff 100%)`;
  }
  rangeBackgroundYear(): string {
    return `linear-gradient(to right, #fff 0%, #fff ${(Number(this.filterForm.controls['yearInputMin'].value) - 1940)/(2023 - 1940)*100}%, #24c5db ${(Number(this.filterForm.controls['yearInputMin'].value) - 1940)/(2023 - 1940)*100}%, #24c5db ${(Number(this.filterForm.controls['yearInputMax'].value) - 1940)/(2023 - 1940) * 100}%, #fff ${(Number(this.filterForm.controls['yearInputMax'].value) - 1940)/(2023 - 1940) * 100}%, #fff 100%)`;
  }

  initPreloader(): void {
    this.preloaderService.loading$
      ?.pipe(tap(val => this.isLoading = val))
      .subscribe();
  }

  toggleMenuState(): void {
    this.isOpen = !this.isOpen;
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

        this.showCollection();
      });
    }
    )
  }

  showCollection() {
    const filterCombinationValue = Object.assign({}, this.filterForm.value, {
      shapes: this.assignFilterValuesShapes(),
      colors: this.assignFilterValuesColors(),
      sizes: this.assignFilterValuesSizes()
    });

    return this.getToysFromAtlas(filterCombinationValue);
  }

  assignFilterValuesShapes() {
    return this.filterForm.value.shapes.includes(true)
      ? this.filterForm.value.shapes.map((selected: boolean, i: number) => {
          return selected
              ? this.toysForUser.shapes[i].name
              : false;
        })
      : this.filterForm.value.shapes.map((selected: boolean, i: number) => this.toysForUser.shapes[i].name)
  }
  assignFilterValuesColors() {
    return this.filterForm.value.colors.includes(true)
      ? this.filterForm.value.colors.map((selected: boolean, i: number) => {
          return selected
              ? this.toysForUser.colors[i].name
              : false;
        })
      : this.filterForm.value.colors.map((selected: boolean, i: number) => this.toysForUser.colors[i].name)
  }
  assignFilterValuesSizes() {
    return this.filterForm.value.sizes.includes(true)
      ? this.filterForm.value.sizes.map((selected: boolean, i: number) => {
          return selected
              ? this.toysForUser.sizes[i].name
              : false;
        })
      : this.filterForm.value.sizes.map((selected: boolean, i: number) => this.toysForUser.sizes[i].name)
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

  resetFilters() {
    this.filterForm.reset({
      amountInputMin: 5,
      amountInputMax: 10,
      yearInputMin: 1940,
      yearInputMax: 2023,
      shapes: this.buildSizeData(this.toysForUser.shapes).value,
      colors: this.buildSizeData(this.toysForUser.colors).value,
      sizes: this.buildSizeData(this.toysForUser.sizes).value,
      favItem: false
    });
  }
}
