import { z, ZodSchema } from "zod";

export const eventSchema = z.object({
  eventName: z.string().min(2, "Event name must be at least 2 characters"),
  eventDate: z.string(),
  location: z.string(),
  details: z.string().optional(),
  capacity: z.string().optional(),
  status: z.string().optional(),
});
