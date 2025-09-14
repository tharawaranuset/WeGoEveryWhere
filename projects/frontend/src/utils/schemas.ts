import { z } from "zod";

export const eventFormSchema = z.object({
  eventName: z.string().min(2, "Event name must be at least 2 characters"),
  eventDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  location: z.string().min(1, "Location is required"),
  details: z.string().optional().default(""),
  capacity: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(0).optional()
  ),
  status: z
    .enum(["unpublish", "publish", "open", "full", "closed"])
    .default("open"),
  photo: z
    .any()
    .transform((v) => (v instanceof File && v.size > 0 ? v : null))
    .nullable()
    .optional(),
});
