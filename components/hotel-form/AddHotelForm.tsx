"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { HotelSchema } from "@/schemas";
import { addHotel } from "@/actions/hotel";
import { Button } from "@/components/ui/button";
import { HotelBasicInfo } from "@/components/hotel-form/hotel-basic-info";
import { HotelLocationDetails } from "@/components/hotel-form/hotel-location-details";
import { HotelAmenities } from "@/components/hotel-form/hotel-amenities";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-succes";
import { Form } from "@/components/ui/form";
import { ImageInput } from "@/components/hotel-form/image-input";

export default function AddHotelForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

 

  const form = useForm({
    resolver: zodResolver(HotelSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      rating: 0,
      price: 0,
      images: [],
      amenities: [],
    },
  });

 

  const onSubmit = async (values: z.infer<typeof HotelSchema>) => {
    setError("");
    setSuccess("");
    setLoading(true)
    try {
     const response = await addHotel({values})

      console.log(values);
      setSuccess("Hotel created successfully!");
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setLoading(false)
      console.log(values)
    }
  };


return (
  <div className="flex flex-col gap-4 p-4">
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          {/* <HotelBasicInfo form={form} /> */}

          {/* Location Section */}
         {/* <HotelLocationDetails form={form} /> */}

          {/* Amenities Section */}
          {/* <HotelAmenities form={form} /> */}
          <ImageInput form={form} />
          {/* <FormError message={error} /> */}
          {/* <FormSuccess message={success} /> */}

          <Button type="submit" disabled={loading} className="w-full">
            Add Hotel
          </Button>
        </form>
      </Form>
    </div>
  </div>
);
}