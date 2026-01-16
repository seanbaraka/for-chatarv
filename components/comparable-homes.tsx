"use client";

import Image from "next/image";
import { Home, BedDouble, Bath } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ComparableHomesProps, NeighborhoodPricingProps } from "@/lib/types";

export function ComparableHomes({
  homes,
  averagePricePerSqft,
  classification,
}: ComparableHomesProps & NeighborhoodPricingProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  if (homes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Similar Properties in the area
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right flex gap-1 items-center">
            <p className="text-xs text-muted-foreground">Avg. Price per Sqft</p>
            <p className="font-semibold">${averagePricePerSqft}</p>
            <Badge className={getClassificationColor(classification)}>
              {classification}
            </Badge>
          </div>
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {homes.map((home, index) => (
            <div
              key={index}
              className="rounded-xl border  text-card-foreground"
            >
              <div className="flex p-2">
                {/* Home Image */}
                <div className="relative w-24 bg-muted flex items-center justify-center">
                  {home.imageUrl ? (
                    <Image
                      src={home.imageUrl}
                      alt={home.address}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <Home className="size-12 text-muted-foreground/50" />
                  )}
                </div>
                <div className="max-w-48 p-2">
                  <h5 className="font-semibold text-xs wrap-break-word line-clamp-2 mb-1">
                    {home.address}
                  </h5>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BedDouble className="size-3.5" />
                      {home.beds} bed{home.beds !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="size-3.5" />
                      {home.baths} bath{home.baths !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* Home Info */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="space-y-1">
                      <p className="font-semibold text-base">
                        {formatPrice(home.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${home.pricePerSqft}/sqft
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
