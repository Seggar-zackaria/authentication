
import { NextResponse } from "next/server";
import Amadeus from "amadeus";
interface LocationResponse {
  data: Array<{
    type: string;
    subType: string;
    name: string;
    iataCode: string;
    address?: {
      cityName: string;
      countryName: string;
    };
  }>;
}


const amadeus = new Amadeus({
  clientId: `${process.env.AMADEUS_CLIENT_ID}`,
  clientSecret: `${process.env.AMADEUS_CLIENT_SECRET}`,
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const subType = searchParams.get('subType') || 'CITY';
  const page = parseInt(searchParams.get('page') || '0', 10);

  if (!keyword) {
    return NextResponse.json({ locations: [] });
  }

  try {
    const response = await amadeus.client.get<LocationResponse>("/v1/reference-data/locations", {
      keyword,
      subType,
      "page[offset]": page * 10
    });

    return NextResponse.json({ locations: response.data });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
} 