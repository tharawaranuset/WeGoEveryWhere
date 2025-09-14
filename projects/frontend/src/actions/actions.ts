'use server';
import { eventSchema } from "@/utils/schemas";

const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : "An Error!!!",
  };
};

export const createEventLogOnly = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData.entries());
    console.log("CREATE EVENT (LOG ONLY):", JSON.stringify(data, null, 2));
    //return { success: true };
  } catch (error) {
    console.error("createEventLogOnly error:", error);
    //return renderError(error);
  }
};

export const createEventWithZod = async (formData: FormData) => {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = eventSchema.safeParse(raw);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("ZOD VALIDATION FAILED:", fieldErrors);
      //return { success: false, errors: fieldErrors };
    }

    console.log("CREATE EVENT (ZOD OK):", JSON.stringify(parsed.data, null, 2));
    //return { success: true, data: parsed.data };
  } catch (error) {
    console.error("createEventWithZod error:", error);
    //return renderError(error);
  }
};
