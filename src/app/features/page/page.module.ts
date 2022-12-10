import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotpageComponent } from './components/notpage/notpage.component';
import { NotpageRoutingModule } from './page-routing.module';

@NgModule({
  declarations: [
    NotpageComponent
  ],
  imports: [
    CommonModule,
    NotpageRoutingModule
  ]
})
export class PageModule { }
