import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.RAPID_API_URL;
    const apiKey = process.env.RAPID_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `${baseUrl}/property?address=${encodedAddress}`;

    const response = await fetch(url, {
      headers: {
        "x-rapidapi-key": apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching neighborhood data:", error);
    return NextResponse.json(
      { error: "Failed to fetch neighborhood data" },
      { status: 500 }
    );
  }
}
