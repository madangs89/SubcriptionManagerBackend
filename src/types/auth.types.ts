type RegisterDTO = {
  email: string;
  password: string;
  name: string;
};

type LoginDTO = {
  email: string;
  password: string;
};

type JwtPayload = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

type GoogleAuthDTO = {
  token: string;
};

export type { RegisterDTO, LoginDTO, JwtPayload, GoogleAuthDTO };
