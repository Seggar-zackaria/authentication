"use client";

import { useState } from "react";
import { FlightSearchForm } from "@/components/amadeus/flight-search-form";
import { FlightResults, Flight } from "@/components/amadeus/flight-results";

export default function FlightSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (values: {
    originCode: string;
    destinationCode: string;
    departureDate: Date;
    adults: number;
  }) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const date = values.departureDate;
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const queryParams = new URLSearchParams({
        originCode: values.originCode,
        destinationCode: values.destinationCode,
        departureDate: formattedDate,
        adults: String(values.adults)
      }).toString();
      
      console.log("Fetching flights with params:", queryParams);
      
      const response = await fetch(`/api/amadeus/flights?${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Search error status:", response.status);
        console.error("Search error text:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.error || "An error occurred during the flight search");
        } catch (error) {
          console.log(error)
          setError(`Search failed: ${errorText || response.statusText}`);
        }
        
        setFlights([]);
        return;
      }
      
      const data = await response.json();
      setFlights(data.flights || []);
    } catch (error) {
      console.error("Flight search error:", error);
      setError("An unexpected error occurred. Please try again later.");
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Flight Search</h1>
      
      <div className="max-w-4xl mx-auto">
        <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {hasSearched && (
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold mb-4">
                    {flights.length > 0
                      ? `${flights.length} flights found`
                      : "No flights found"}
                  </h2>
                )}
                
                <FlightResults flights={flights} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 