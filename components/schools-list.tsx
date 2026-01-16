import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schools</CardTitle>
        <p className="text-sm text-muted-foreground">
          School District: {schoolDistrict}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schools.map((school, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{school.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {school.address}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getTypeColor(school.type)}>
                    {school.type}
                  </Badge>
                  {school.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {school.rating}/10
                      </span>
                      <span className="text-xs text-muted-foreground">
                        rating
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Distance: {school.distance}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
