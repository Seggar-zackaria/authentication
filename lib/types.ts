import { UseFormReturn } from "react-hook-form";
import { HotelSchema } from "@/schemas";
import * as z from "zod";

export interface HotelFormProps {
    form: UseFormReturn<z.infer<typeof HotelSchema>>;
}