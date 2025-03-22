import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

interface AirlineResponse {
  data: Array<{
    type: string;
    iataCode: string;
    businessName: string;
    commonName: string;
  }>;
}

interface FormattedAirline {
  value: string;
  label: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ airlines: [] });
  }

  try {
    const response = await amadeus.referenceData.airlines.get({
      keyword
    }) as { data: AirlineResponse['data'] };

    const airlines: FormattedAirline[] = response.data.map((airline) => ({
      value: airline.iataCode,
      label: `${airline.businessName} (${airline.iataCode})`
    }));

    return NextResponse.json({ airlines });
  } catch (error) {
    console.error('Airline search error:', error);
    return NextResponse.json({ error: 'Failed to fetch airlines' }, { status: 500 });
  }
} 