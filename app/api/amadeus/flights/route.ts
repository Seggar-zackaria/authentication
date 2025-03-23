import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAmadeusToken } from '@/app/api/amadeus/utils';


interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }>;
  }>;
}

interface FlightOffersResponse {
  data: FlightOffer[];
  dictionaries?: {
    locations: Record<string, {
      cityCode: string;
      countryCode: string;
    }>;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

const AMADEUS_API_URL = "https://test.api.amadeus.com";


function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  
  return hours * 60 + minutes;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const originCode = searchParams.get('originCode');
  const destinationCode = searchParams.get('destinationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults') || '1';
  
  if (!originCode || !destinationCode || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' }, 
      { status: 400 }
    );
  }

  try {
    const token = await getAmadeusToken();
    
    const response = await axios.get<FlightOffersResponse>(
      `${AMADEUS_API_URL}/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate,
          adults,
          currencyCode: 'USD',
          max: 20
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // USD to DZD conversion rate (approx.)
    const USD_TO_DZD_RATE = 135.02;

    // Format flight data for easier consumption by frontend
    const flights = response.data.data.map(offer => {
      const itinerary = offer.itineraries[0]; 
      const firstSegment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];
      
      const departureTime = new Date(firstSegment.departure.at);
      const arrivalTime = new Date(lastSegment.arrival.at);
      const stops = itinerary.segments.length - 1;
      
      const airline = response.data.dictionaries?.carriers?.[firstSegment.carrierCode] || firstSegment.carrierCode;
      
      // Convert price from USD to DZD
      const priceInUSD = parseFloat(offer.price.total);
      const priceInDZD = priceInUSD * USD_TO_DZD_RATE;
      
      return {
        id: offer.id,
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        airline,
        price: priceInDZD,
        currency: 'DZD',
        departureCity: firstSegment.departure.iataCode,
        arrivalCity: lastSegment.arrival.iataCode,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        duration: parseDuration(itinerary.duration),
        stops,
        segments: itinerary.segments.map(segment => ({
          departureAirport: segment.departure.iataCode,
          arrivalAirport: segment.arrival.iataCode,
          departureTime: new Date(segment.departure.at).toISOString(),
          arrivalTime: new Date(segment.arrival.at).toISOString(),
          airline: response.data.dictionaries?.carriers?.[segment.carrierCode] || segment.carrierCode,
          flightNumber: `${segment.carrierCode}${segment.number}`,
          duration: parseDuration(segment.duration)
        }))
      };
    });

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Flight search error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: 'Failed to fetch flights', details: error.response.data }, 
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch flights' }, 
      { status: 500 }
    );
  }
} 