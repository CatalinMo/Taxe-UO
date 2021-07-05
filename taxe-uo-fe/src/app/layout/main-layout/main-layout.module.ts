import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FormsModule } from '@angular/forms';
import { ScrollToTopComponent } from "./components/scroll-to-top/scroll-to-top.component";

@NgModule({
  declarations: [
    MainNavComponent,
    MainContentComponent,
    ScrollToTopComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainLayoutModule {
}
