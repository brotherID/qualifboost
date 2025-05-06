export interface UserRequest {
  username: string,
  enabled: boolean,
  firstName: string,
  lastName: string,
  email: string,
  emailVerified: boolean,
  password: string,
  rolesName: string[]
}
