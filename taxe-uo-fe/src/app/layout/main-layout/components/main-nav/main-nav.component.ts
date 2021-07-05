import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserViewModel } from "../../../../shared/modules/authorization/models/user.view.model";
import { UserRole } from "../../../../shared/modules/authorization/enums/user-role";
import { AuthorizationServiceRepository } from "../../../../shared/modules/authorization/services/authorization/authorization.service.repository";

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  user: UserViewModel;
  userRole = UserRole;

    constructor(
      private router: Router,
      private authorizationService: AuthorizationServiceRepository
    ) {}

    ngOnInit() {
      this.subscribeOnToken();

      this.user = AuthorizationServiceRepository.getCurrentUserValue();
    }

  subscribeOnToken() {
    this.authorizationService.currentTokenSubject
      .subscribe((token: string) => {
        if (!AuthorizationServiceRepository.getCurrentTokenValue()) {
          this.router.navigateByUrl('/auth/login');
        }
      })
  }

  logout() {
    this.authorizationService.logout();
  }
}
