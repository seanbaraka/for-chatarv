"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { SchoolsListProps } from "@/lib/types";

export function SchoolsList({ schoolDistrict, schools }: SchoolsListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Elementary":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Middle":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "High":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Private":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    // Convert 0-10 rating to 0-5 stars
    const starRating = rating / 2;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="size-3 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={i + fullStars + (hasHalfStar ? 1 : 0)}
            className="size-3 text-yellow-400/30"
          />
        ))}
      </div>
    );
  };

  if (schools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Schools in the {schoolDistrict} area
        </h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {schools.map((school, index) => (
            <div
              key={index}
              className="rounded-lg border text-card-foreground overflow-hidden"
            >
              {/* School Info */}
              <div className="flex flex-col gap-3 p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {school.name}
                  </h3>
                  <Badge
                    className={getTypeColor(school.type)}
                    variant="outline"
                  >
                    {school.type}
                  </Badge>
                </div>

                {/* Star Rating */}
                {school.rating ? (
                  <div className="flex items-center gap-2">
                    {renderStars(school.rating)}
                    <span className="text-xs font-medium text-muted-foreground">
                      {school.rating}/10
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Rating not available
                  </span>
                )}

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {school.distance} from this address
                  </p>
                  <p className="text-xs text-muted-foreground">
                    District: {schoolDistrict}
                  </p>
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
