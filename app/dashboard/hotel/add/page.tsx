"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { HotelSchema } from "@/schemas";
import { addHotel } from "@/actions/hotel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-succes";
import { useLocation } from "@/hooks/useLocation";
import { ICountry, IState, ICity } from "country-state-city";
import { Badge } from "@/components/ui/badge";
import { X, Star } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Progress } from "@/components/ui/progress";

const PRESET_AMENITIES = [
  "WiFi",
  "Gym",
  "Pool",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Parking",
  "Air Conditioning",
  "Conference Room",
  "Business Center",
  "Laundry Service",
  "Airport Shuttle",
  "Fitness Center",
  "Beach Access",
] as const;

export default function AddHotel() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [amenityInput, setAmenityInput] = useState<string>("");

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries;
  const { uploadProgress, uploadImages, isUploading } = useImageUpload();

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

    try {
      // TODO: Implement API call to create hotel
      // const response = await addHotel(values);
      // if (response.status === 201) {
      //   setSuccess("Hotel created successfully!");
      // } else {
      //   setError(response.error);
      // }

      console.log(values);
      setSuccess("Hotel created successfully!");
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 grid grid-cols-1 md:grid-cols-2 items-start gap-6"
          >
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6">
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
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 cursor-pointer ${
                                star <= field.value
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() => field.onChange(star)}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            ({field.value} stars)
                          </span>
                        </div>
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
                          placeholder="0.00DZ" 
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
            
               {/* Location Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Location Details</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter street address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedCountry}
                            onChange={(e) => {
                              const country = e.target.value;
                              setSelectedCountry(country);
                              field.onChange(country);
                              const countryStates = getCountryStates(country);
                              setStates(countryStates);
                              setSelectedState("");
                              setSelectedCity("");
                              form.setValue("city", "");
                            }}
                          >
                            <option value="">Select Country</option>
                            {countries.map((country: ICountry) => (
                              <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedCountry && (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={selectedState}
                          onChange={(e) => {
                            const state = e.target.value;
                            setSelectedState(state);
                            const stateCities = getStateCities(selectedCountry, state);
                            setCities(stateCities);
                            setSelectedCity("");
                            form.setValue("city", "");
                          }}
                        >
                          <option value="">Select State</option>
                          {states.map((state: IState) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedCity}
                            onChange={(e) => {
                              const city = e.target.value;
                              setSelectedCity(city);
                              field.onChange(city);
                            }}
                            disabled={!selectedState}
                          >
                            <option value="">Select City</option>
                            {cities.map((city: ICity) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Hotel Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Hotel Images</h2>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        
                        {/* Upload Progress */}
                        {uploadProgress.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{item.file.name}</span>
                              <span>{Math.round(item.progress)}%</span>
                            </div>
                            <Progress value={item.progress} />
                          </div>
                        ))}

                        {/* Display uploaded images */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {field.value.map((url: string, index: number) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Hotel image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(url)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Hotel Amenities</h2>
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Amenities</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                          {PRESET_AMENITIES.map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="outline"
                              className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                                field.value.includes(amenity) 
                                  ? "bg-primary text-primary-foreground" 
                                  : ""
                              }`}
                              onClick={() => handleAmenityClick(amenity)}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <Input
                            placeholder="Add custom amenity and press Enter..."
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            onKeyDown={handleAddAmenity}
                          />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                Selected Amenities ({field.value.length})
                              </span>
                              {field.value.length > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleClearAmenities}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  Clear All
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[50px]">
                              {field.value.map((amenity: string) => (
                                <Badge
                                  key={amenity}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {amenity}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => handleRemoveAmenity(amenity)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button type="submit" className="w-full">
              Add Hotel
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
