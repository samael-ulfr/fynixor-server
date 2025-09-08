export interface SignInErrorsTypes {
  username: string;
  password: string;
}

export interface SignInPayloadTypes {
  email: string;
  password: string;
}
export interface SignUpPayloadTypes {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
}
