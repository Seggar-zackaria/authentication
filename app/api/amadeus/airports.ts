import { NextResponse } from 'next/server';
import axios from 'axios';

interface LocationResponse {
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    iataCode: string;
    address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
    };
  }>;
}

const AMADEUS_API_URL = "https://test.api.amadeus.com";
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

async function getAmadeusToken() {
  try {
    const response = await axios.post(
      `${AMADEUS_API_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID!,
        client_secret: AMADEUS_CLIENT_SECRET!
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw new Error('Failed to authenticate with Amadeus API');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ locations: [] });
  }

  try {
    const token = await getAmadeusToken();
    const response = await axios.get<LocationResponse>(
      `${AMADEUS_API_URL}/v1/reference-data/locations`,
      {
        params: {
          keyword,
          subType: 'CITY,AIRPORT'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const locations = response.data.data.map(location => ({
      value: location.iataCode,
      label: `${location.name}, ${location.address.cityName}`
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
} 