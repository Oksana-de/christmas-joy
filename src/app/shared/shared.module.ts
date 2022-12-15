import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToyItemComponent } from './components/toy-item/toy-item.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ToyItemComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToyItemComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
