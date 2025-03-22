import React from 'react';
import { Autocomplete } from './Autocomplete';

export function FlightForm() {
  const handleAirlineSelect = (value: string) => {
    console.log('Selected airline:', value);
  };

  const handleAirportSelect = (value: string) => {
    console.log('Selected airport:', value);
  };

  return (
    <div>
      <h2>Flight Form</h2>
      <Autocomplete
        endpoint="/api/amadeus/airlines"
        placeholder="Search for airlines"
        onSelect={handleAirlineSelect}
      />
      {/* <Autocomplete
        endpoint="/api/amadeus/airports"
        placeholder="Search for airports"
        onSelect={handleAirportSelect}
      /> */}
    </div>
  );
} 