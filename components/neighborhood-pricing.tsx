"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NeighborhoodPricingProps } from "@/lib/types";

export function NeighborhoodPricing({
  averagePricePerSqft,
  classification,
}: NeighborhoodPricingProps) {
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Cheap":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Expensive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Average Price per Square Foot
            </span>
            <span className="font-semibold text-lg">
              ${averagePricePerSqft}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Neighborhood Classification
            </span>
            <Badge className={getClassificationColor(classification)}>
              {classification}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
