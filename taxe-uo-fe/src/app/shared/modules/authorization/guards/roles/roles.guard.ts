import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from '../../enums/user-role';
import {AuthorizationServiceRepository} from '../../services/authorization/authorization.service.repository';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor() {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return !!route.data.roles.find((role: UserRole) => role === AuthorizationServiceRepository.getCurrentUserValue().role);

    }

}
