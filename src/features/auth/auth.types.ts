export type AuthMode = "register" | "login";

export type AuthInput = {
  email: string;
  password: string;
  claimToken?: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
  };
  attemptClaimed: boolean;
};
