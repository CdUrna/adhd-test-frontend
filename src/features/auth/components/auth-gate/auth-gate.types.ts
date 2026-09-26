import type { AuthMode, AuthResponse } from "../../auth.types";

export type AuthFormValues = {
  email: string;
  password: string;
};

export type AuthGateProps = {
  claimToken?: string;
  initialMode?: AuthMode;
  allowRegistration?: boolean;
  onAuthenticated: (result: AuthResponse) => void;
  onCancel?: () => void;
};
