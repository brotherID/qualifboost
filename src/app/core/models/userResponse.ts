import {Role} from './role';

export interface UserResponse {
  idUserAccount: string,
  username: string,
  enable: boolean,
  firstName: string,
  lastName: string,
  email: string,
  emailVerified: boolean,
  roles: Role[],
  password: string
}

