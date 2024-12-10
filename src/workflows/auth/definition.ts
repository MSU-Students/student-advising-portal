import { IProfile, IRequest } from 'src/entities';
import { Struct } from 'src/structs';
export type SignUpPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  avatar?: File;
};
export type Auth =
  | Struct<
    'loginWithGoogle',
    {
      success: (profile: IProfile) => void;
      error?: ErrorCallback;
    }
  >
  | Struct<
    'logOut',
    {
      success: VoidCallback;
      error: ErrorCallback;
    }
  >
  | Struct<
    'createRequest',
    {
      applicant: IRequest;
      success: VoidCallback;
      error: ErrorCallback;
    }
  >
  | Struct<
    'signUpWithEmail',
    {
      payload: SignUpPayload;
      success?: VoidCallback;
      error?: ErrorCallback;
    }
  >
  | Struct<
    'resetPassword',
    {
      payload: {
        oobCode: string;
        newPassword: string;
      };
      success?: VoidCallback;
      error?: ErrorCallback;
    }
  >
  | Struct<
    'sendResetPassword',
    {
      payload: string;
      success?: VoidCallback;
      error?: ErrorCallback;
    }
  >;
