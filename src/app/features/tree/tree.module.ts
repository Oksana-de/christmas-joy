import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './containers/tree/tree.component';
import { TreeRoutingModule } from './tree-routing.module';

@NgModule({
  declarations: [
    TreeComponent
  ],
  imports: [
    CommonModule,
    TreeRoutingModule
  ],
  exports: [
    TreeComponent
  ]
})
export class TreeModule { }
