import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToyComponent } from './containers/toy/toy.component';
import { ToysComponent } from './containers/toys/toys.component';

const routes: Routes = [
  {
    path: '',
    component: ToysComponent
  },
  {
    path: 'add',
    component: ToyComponent
  },
  {
    path: ':id',
    component: ToyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
