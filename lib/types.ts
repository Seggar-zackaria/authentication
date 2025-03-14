import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { HotelSchema, HotelUpdateSchema } from "@/schemas";

export interface HotelFormProps {
    form: UseFormReturn<z.infer<typeof HotelSchema> | z.infer<typeof HotelUpdateSchema>>;
}