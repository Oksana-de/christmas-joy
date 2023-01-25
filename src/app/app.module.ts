import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PageModule } from './features/page/page.module';
import { ToysModule } from './features/toys/toys.module';
import { TreeModule } from './features/tree/tree.module';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './features/main/main.module';
import { AboutModule } from './features/about/about.module';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    MainModule,
    ToysModule,
    TreeModule,
    AboutModule,
    PageModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
