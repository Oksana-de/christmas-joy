import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToysComponent } from './containers/toys/toys.component';
import { ToyComponent } from './containers/toy/toy.component';
import { ToysRoutingModule } from './toys-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ToysComponent,
    ToyComponent
  ],
  imports: [
    CommonModule,
    ToysRoutingModule,
    SharedModule
  ],
  exports: [
    ToysComponent
  ]
})
export class ToysModule { }
