import { Injectable } from '@angular/core';
import { ModelAdapter } from '../../model-adapter/interfaces/model-adapter';
import { UserRole } from '../enums/user-role';
import { UserViewModel } from '../models/user.view.model';

@Injectable()
export class UserViewAdapter implements ModelAdapter<UserViewModel> {

    adapt(data: any): UserViewModel {
        const adapt = new UserViewModel();
        adapt.email = data.email;
        adapt.lastName = data.lastName;
        adapt.firstName = data.firstName;
        adapt.role = <UserRole>data.role;

        return adapt;
    }

}
