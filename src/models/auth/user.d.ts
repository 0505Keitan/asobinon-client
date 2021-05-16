export interface User {
  uid: string;
  isAnonymous: boolean;
  name: string;
  email: string;
  photoURL: string;
}

export interface UserWithGH extends User {
  isMemberOfOrg: boolean;
}

export interface UserError {
  message: string;
}
