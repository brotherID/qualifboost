export type UserRole = 'RC' | 'RT' | 'CP';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}
