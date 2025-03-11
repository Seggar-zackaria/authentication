"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ICountry, IState, ICity } from "country-state-city";
import { HotelFormProps } from "@/lib/types"

export function HotelLocationDetails({ form }: HotelFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries;

  // Add effect to reset location fields when form is reset
  useEffect(() => {
    const subscription = form.watch(() => {
      const country = form.getValues("country");
      const state = form.getValues("state");
      const city = form.getValues("city");

      if (!country) {
        setSelectedCountry("");
        setStates([]);
      }
      if (!state) {
        setSelectedState("");
        setCities([]);
      }
      if (!city) {
        setSelectedCity("");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const country = e.target.value;
      setSelectedCountry(country);
      form.setValue("country", country);

      const countryStates = getCountryStates(country);
      setStates(countryStates);

      setSelectedState("");
      form.setValue("state", "");
      setSelectedCity("");
      form.setValue("city", "");
    },
    [form, getCountryStates]
  );

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const state = e.target.value;
      setSelectedState(state);
      form.setValue("state", state);
      
      const stateCities = getStateCities(selectedCountry, state);
      setCities(stateCities);
      setSelectedCity("");
      form.setValue("city", "");
    },
    [form, getStateCities, selectedCountry]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const city = e.target.value;
      setSelectedCity(city);
      form.setValue("city", city);
    },
    [form]
  );

  return (
    <Form {...form}>
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
                      onChange={handleCountryChange}
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
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={field.value || selectedState}
                        onChange={(e) => {
                          field.onChange(e);
                          handleStateChange(e);
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
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      onChange={handleCityChange}
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
    </Form>
  );
}
