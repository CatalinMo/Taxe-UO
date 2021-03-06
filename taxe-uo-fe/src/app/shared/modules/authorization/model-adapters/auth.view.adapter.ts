import { Injectable } from '@angular/core';
import { ModelAdapter } from '../../model-adapter/interfaces/model-adapter';
import { AuthViewModel } from '../models/auth.view.model';
import { UserViewAdapter } from './user.view.adapter';

@Injectable()
export class AuthViewAdapter implements ModelAdapter<AuthViewModel> {

    constructor(
        private userAdapter: UserViewAdapter
    ) {
    }

    adapt(data: any): AuthViewModel {
        const adapt = new AuthViewModel();
        adapt.token = data.token;
        adapt.user = this.userAdapter.adapt(data.user);

        return adapt;
    }

}
