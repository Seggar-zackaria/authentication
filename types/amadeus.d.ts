declare module 'amadeus' {
  interface AmadeusConstructor {
    clientId: string;
    clientSecret: string;
  }

  interface Airline {
    iataCode: string;
    businessName: string;
  }

  class Amadeus {
    constructor(config: AmadeusConstructor);
    referenceData: {
      airlines: {
        get(params: { keyword: string }): Promise<{ data: Airline[] }>;
      };
    };
  }

  export default Amadeus;
} 