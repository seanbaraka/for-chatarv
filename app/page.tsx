"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolsList } from "@/components/schools-list";
import { ComparableHomes } from "@/components/comparable-homes";
import { NeighborhoodPricing } from "@/components/neighborhood-pricing";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { useNeighborhoodQuery } from "@/hooks/use-neighborhood-query";
import type {
  ApiResponse,
  ApiSchool,
  ApiNearbyHome,
  NeighborhoodData,
  PricingClassification,
} from "@/lib/types";

// Transform API response to our expected format
function transformApiData(
  apiResponse: ApiResponse,
  inputAddress: string
): NeighborhoodData {
  // Extract schools from API response
  const schools = apiResponse.schools || [];

  // Transform schools - map level to type and handle Private schools
  const transformedSchools = schools.map((school: ApiSchool) => {
    let schoolType: "Elementary" | "Middle" | "High" | "Private";

    if (school.type === "Private") {
      schoolType = "Private";
    } else {
      // Map level to our type
      const level = school.level?.toLowerCase() || "";
      if (level.includes("elementary")) {
        schoolType = "Elementary";
      } else if (level.includes("middle") || level.includes("junior")) {
        schoolType = "Middle";
      } else if (level.includes("high")) {
        schoolType = "High";
      } else {
        schoolType = "Elementary"; // default
      }
    }

    // Format address from school data if available, otherwise use empty string
    const schoolAddress = "";

    return {
      name: school.name || "Unknown School",
      type: schoolType,
      distance: school.distance ? `${school.distance} miles` : "N/A",
      rating: school.rating || undefined,
      address: schoolAddress,
    };
  });

  // Extract comparable homes from nearbyHomes
  const nearbyHomes = apiResponse.nearbyHomes || [];

  // Filter to only include homes with valid living area and price, and transform them
  const transformedHomes = nearbyHomes
    .filter((home: ApiNearbyHome) => {
      const sqft = home.livingAreaValue || home.livingArea || 0;
      const price = home.price || 0;
      return sqft > 0 && price > 0 && home.homeType === "SINGLE_FAMILY";
    })
    .map((home: ApiNearbyHome) => {
      const price = home.price || 0;
      const sqft = home.livingAreaValue || home.livingArea || 0;
      const pricePerSqft = sqft > 0 ? Math.round(price / sqft) : 0;

      // Format address from address object
      const addressObj = home.address || {};
      const fullAddress = [
        addressObj.streetAddress,
        addressObj.city,
        addressObj.state,
        addressObj.zipcode,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        address: fullAddress || "Address not available",
        price,
        sqft,
        beds: home.bedrooms || 0,
        baths: home.bathrooms || 0,
        pricePerSqft,
      };
    })
    .slice(0, 10); // Limit to 10 comparable homes

  // Calculate average price per sqft from comparable homes
  const averagePricePerSqft =
    transformedHomes.length > 0
      ? Math.round(
          transformedHomes.reduce(
            (sum: number, home) => sum + home.pricePerSqft,
            0
          ) / transformedHomes.length
        )
      : 0;

  // Determine classification
  let classification: PricingClassification;
  if (averagePricePerSqft < 100) {
    classification = "Cheap";
  } else if (averagePricePerSqft <= 300) {
    classification = "Moderate";
  } else {
    classification = "Expensive";
  }

  // Extract school district from resoFacts
  const resoFacts = apiResponse.resoFacts || {};
  const schoolDistrict =
    resoFacts.highSchoolDistrict ||
    resoFacts.middleOrJuniorSchoolDistrict ||
    resoFacts.elementarySchoolDistrict ||
    "Unknown District";

  return {
    address: inputAddress,
    coordinates: {
      lat: apiResponse.latitude || 0,
      lng: apiResponse.longitude || 0,
    },
    schoolDistrict,
    schools: transformedSchools,
    comparableHomes: transformedHomes,
    pricing: {
      averagePricePerSqft,
      classification,
    },
  };
}

export default function Home() {
  const [address, setAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");

  // Use React Query - this will cache results for 5 minutes
  const {
    data: apiResponse,
    isLoading,
    error: queryError,
  } = useNeighborhoodQuery(submittedAddress, !!submittedAddress);

  // Transform the data when available
  const data = apiResponse
    ? transformApiData(apiResponse, submittedAddress)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      return;
    }
    // Set submitted address to trigger the query
    setSubmittedAddress(address.trim());
  };

  // Get error message
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
      ? "Failed to fetch neighborhood data"
      : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 mb-2">
            Neighborhood Insights
          </h1>
          <p className="text-muted-foreground">
            Enter a home address to discover schools, comparable homes, and
            neighborhood pricing
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={(selectedAddress) => {
                    setAddress(selectedAddress);
                  }}
                  placeholder="16105 SE 113th Place, Renton, WA 98059"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !address.trim()}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Loading..." : "Get Neighborhood Insights"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {data && (
          <div className="space-y-6">
            <SchoolsList
              schoolDistrict={data.schoolDistrict}
              schools={data.schools}
            />
            <ComparableHomes homes={data.comparableHomes} />
            <NeighborhoodPricing
              averagePricePerSqft={data.pricing.averagePricePerSqft}
              classification={data.pricing.classification}
            />
          </div>
        )}
      </main>
    </div>
  );
}
