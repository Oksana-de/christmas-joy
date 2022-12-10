import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeComponent } from '../tree/containers/tree/tree.component';
import { ToyComponent } from '../toys/containers/toy/toy.component';
import { ToysComponent } from '../toys/containers/toys/toys.component';
import { MainComponent } from './containers//main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'start',
    component: MainComponent
  },
  {
    path: 'toys',
    component: ToysComponent
  },
  {
    path: 'tree',
    component: TreeComponent
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
export class MainRoutingModule { }
