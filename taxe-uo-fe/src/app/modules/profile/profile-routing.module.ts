import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: 'profil',
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
