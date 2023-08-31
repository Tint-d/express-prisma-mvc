interface BaseType {
  name: string;
}

export interface CategoryType extends BaseType {}

export interface CreateProductRequest extends BaseType {
  price: number;
  description: string;
  categoryId: number;
}

export interface SinginUserType extends BaseType {
  id: number;
  email: string | null | undefined;
  password: string;
  password_confirmation: string;
}

export interface ProcessEnv {
  jwtabc: string | undefined;
}
