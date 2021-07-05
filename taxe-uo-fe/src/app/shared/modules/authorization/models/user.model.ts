import { UserRole } from '../enums/user-role';

export class UserModel {

    firstName: string;
    lastName: string;
    email: string;
    cnp: string;
    role: UserRole;
}
