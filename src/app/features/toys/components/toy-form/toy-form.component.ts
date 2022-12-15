import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, pairwise, tap } from 'rxjs';
import { Toy } from 'src/app/core/components/interfaces/toy.interface';
import { ToysService } from '../../services/toys.service';

@Component({
  selector: 'app-toy-form',
  templateUrl: './toy-form.component.html',
  styleUrls: ['./toy-form.component.scss']
})
export class ToyFormComponent implements OnInit {
  pattern: RegExp = /^\d{2}\/\d{2}\/\d{2}$/;

  toysForm!: FormGroup;
  id!: number;
  toy!: Toy;
  isFormEdited!: boolean;

  constructor(
    private toysServise: ToysService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.isFormEdited = true;
      this.getToy();
    }
  }

  private initForm(): void {
    this.toysForm = this.fb.group({
      title: ['', [Validators.required]],
      picture: ['12.png'],
      amount: ['1', [Validators.required]],
      year: ['', [Validators.required]],
      shape: ['', [Validators.required]],
      color: ['', [Validators.required]],
      size: ['', [Validators.required]],
      fave: ['', [Validators.required]]
    })
    // this.toysForm = this.fb.group({
    //   title: ['', [Validators.required, CustomValidator.checkMaxLength(50)]],
    //   description: ['', [Validators.required, CustomValidator.checkMaxLength(50)]],
    //   date: ['', [Validators.required, CustomValidator.checkDateFormat(this.pattern)]],
    //   duration: ['', [Validators.required, CustomValidator.checkCourseDuration(1, 600)]],
    //   author: ['Author 1', [Validators.required]]
    // })
  }

  createToy() {
    this.toysServise.addToy(this.toysForm.value).subscribe();
  }

  editToy() {
    this.toysServise.editToy(this.id, this.toysForm.value).subscribe();
  }

  onSubmit(): void {
    this.isFormEdited
      ? this.editToy()
      : this.createToy();
  }

  getToy() {
    this.toysServise.getToy(this.id).pipe(
      tap(toy => this.toy = toy),
      tap(() => this.toysForm.patchValue(this.toy))
    )
    .subscribe();
  }

  get isFormValid(): boolean {
    return this.toysForm.valid;
  }
}
