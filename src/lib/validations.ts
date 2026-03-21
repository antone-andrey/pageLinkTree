import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-z0-9-]+$/, "Username can only contain lowercase letters, numbers, and hyphens");

export const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().url("Invalid URL"),
  iconUrl: z.string().url().optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const pageSchema = z.object({
  themeId: z.string().optional(),
  isPublished: z.boolean().optional(),
  showBranding: z.boolean().optional(),
  customBgUrl: z.string().nullable().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  description: z.string().max(500).optional(),
  durationMins: z.number().int().min(15).max(480),
  price: z.number().int().min(0),
  currency: z.string().default("usd"),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Invalid email"),
  startTime: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const reorderSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      position: z.number().int().min(0),
    })
  ),
});
