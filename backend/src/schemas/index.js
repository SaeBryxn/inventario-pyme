// Esquemas de validación con Zod para las entradas de la API.
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const clienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  documento: z.string().max(20).optional().nullable(),
  telefono: z.string().max(20).optional().nullable(),
  email: z.string().email('Email inválido').optional().or(z.literal('')).nullable(),
});

export const usuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['admin', 'vendedor']).optional(),
});

export const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional().nullable(),
});
