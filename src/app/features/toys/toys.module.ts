import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToysComponent } from './containers/toys/toys.component';
import { ToyComponent } from './containers/toy/toy.component';
import { ToysRoutingModule } from './toys-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToyFormComponent } from './components/toy-form/toy-form.component';

@NgModule({
  declarations: [
    ToysComponent,
    ToyComponent,
    ToyFormComponent
  ],
  imports: [
    CommonModule,
    ToysRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ToysComponent,
    ToyComponent
  ]
})
export class ToysModule { }
