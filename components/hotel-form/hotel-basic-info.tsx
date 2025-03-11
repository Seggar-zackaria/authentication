"use client";

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/hotel-form/star-rating";
import { HotelFormProps } from "@/lib/types";

export function HotelBasicInfo({ form }: HotelFormProps) {
  return (
    <Form {...form}>

    <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hotel Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter hotel name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Rating</FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price per Night</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
                placeholder="0.00" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              placeholder="Enter hotel description"
              className="min-h-[100px]"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
  </Form>

)
}