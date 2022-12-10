import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeComponent } from '../tree/containers/tree/tree.component';
// import { ToyComponent } from './containers/toy/toy.component';
import { ToysComponent } from './containers/toys/toys.component';

const routes: Routes = [
  {
    path: '',
    component: ToysComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
