import { z } from "zod";

export const subRoleSchema = z.object({
  id: z.number(),
  nameRef: z.number(),
  main: z.boolean(),
  name: z.string(),
  title: z.string(),
  icon: z.string(),
  isMenu: z.boolean(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  nameRef: z.number(),
  main: z.boolean(),
  rolsList: z.array(subRoleSchema),
});

export const createRoleSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").nonempty("El nombre es obligatorio"),
  nameRef: z.number().default(0),
  main: z.boolean().default(true), 
  title: z.string().nonempty("El titulo es obligatorio"),
  icon: z.string().optional(),
  isMenu: z.boolean().default(false), 
});

export const updateRoleSchema = createRoleSchema.partial();

// Tipos
export type Role = z.infer<typeof roleSchema>;
export type SubRole = z.infer<typeof subRoleSchema>;
export type CreateRole = z.infer<typeof createRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;

