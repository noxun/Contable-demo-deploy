export type LoginResponse = {
  token: string;
  user: User;
  ufvRegister: boolean;
};

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  fatherLastName: string;
  motherLastName: string;
  ci: string;
  status: string;
  photoUrl: any;
  creationDate: string;
  lastActive: string;
};

export type Ufv = {
  tc: string;
  ufv: string;
}