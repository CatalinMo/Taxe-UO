import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { UserRole } from '../enums/user-role';
import { ModelAdapter } from '../../model-adapter/interfaces/model-adapter';

@Injectable()
export class UserAdapter implements ModelAdapter<UserModel> {

    adapt(data: any): UserModel {
        const adapt = new UserModel();
        adapt.email = data.email;
        adapt.cnp = data.cnp;
        adapt.lastName = data.lastName;
        adapt.firstName = data.firstName;
        adapt.role = <UserRole>data.role;

        return adapt;
    }

}
