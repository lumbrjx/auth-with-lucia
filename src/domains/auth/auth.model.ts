import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
});

export const RegisterOauthSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string(),
});

export interface RegisterData extends z.infer<typeof RegisterSchema> {}
export interface LoginData extends z.infer<typeof LoginSchema> {}
export interface RegisterOauthData
  extends z.infer<typeof RegisterOauthSchema> {}
