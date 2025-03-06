import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUploader } from "@/app/dashboard/_component/imageUploader";
import { Control } from "react-hook-form";

interface ImageFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  maxFiles?: number;
}

export function ImageField({ name, control, label, maxFiles }: ImageFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ImageUploader
              value={field.value || []}
              onChange={field.onChange}
              maxFiles={maxFiles}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}