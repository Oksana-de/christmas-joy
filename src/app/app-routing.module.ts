import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    loadChildren: () => import('./features/main/main.module').then(m => m.MainModule),
  },
  {
    path: 'toys',
    loadChildren: () => import('./features/toys/toys.module').then(m => m.ToysModule),
  },
  {
    path: 'tree',
    loadChildren: () => import('./features/tree/tree.module').then(m => m.TreeModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
  },
  {
    path: '**',
    loadChildren: () => import('./features/page/page.module').then(m => m.PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
